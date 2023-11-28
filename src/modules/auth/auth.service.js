import { configDotenv } from 'dotenv';
import process from 'process';
import InternalErrorException from '../../server/exceptions/internal-error.exception.js';
import UnauthorizedException from '../../server/exceptions/unauthorized.exception.js';

configDotenv();

export default class AuthService{
	/**
     * 
     * @param {import('jsonwebtoken').Jwt} jwt 
	 * @param {import('../users/user.service.js').default} userService
	 * @param {import('../hash/hash.service.js').default} hashService
     * @param {string} secret 
     */
	constructor(jwt, userService, hashService, secret = process.env.JWT_SECRET){
		/**
         * @private 
         * */
		this.jwt = jwt;

		/**
         * @private
         */
		this.secret = secret;

		/**
         * @private
         */
		this.userService = userService;

		/**
         * @private
         */
		this.hashService = hashService;
	}

	/**
	 * 
	 * @param {string} email 
	 * @param {string} password 
	 */
	async signIn(email, password){
		const user = await this.userService.findByEmail(email);

		if(!user) 
			throw new UnauthorizedException('Email or/and password are incorrect.');

		const passwordIsCorrect = await this.hashService.compare(password, user.password);

		if(!passwordIsCorrect) 
			throw new UnauthorizedException('Email or/and password are incorrect.');

		const token = await this.createToken(user);

		const {_id, createdAt, updatedAt, lastLogin} = user;

		return {
			id: _id,
			createdAt,
			updatedAt,
			lastLogin,
			token
		};
	}

	/**
	 * @public
	 * @param { UserEntity } user
	 */
	async createToken(user){
		try{
			const token = await this.jwt.sign({ id: user.id }, this.secret, { expiresIn: '0.3h' });
			return token;
		}catch(e){
			console.log(e);
			throw new InternalErrorException();
		}
	}

	/**
     * @public
     * @param {string} authorizationHeader
     * @returns {string}
     */
	getTokenFromHeader(authorizationHeader){
		const token = authorizationHeader.split(' ')[1];
		if(!token?.trim())
			throw new UnauthorizedException('Missing Bearer Token.');
        
		return token;
	}

	/**
     * @public
     * @param {string} token 
     */
	async decodeToken(token){
		try{
			const decodedToken = await this.jwt.verify(token, this.secret);
			return decodedToken;
		}catch{
			throw new UnauthorizedException('Invalid Token.');
		}
	}
}