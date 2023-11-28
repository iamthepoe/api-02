import { configDotenv } from 'dotenv';
import process from 'process';
import InternalErrorExecption from '../../server/exceptions/internal-error.exception.js';
import UnauthorizedExecption from '../../server/exceptions/unauthorized.exception.js';

configDotenv();

export default class AuthService{
	/**
     * 
     * @param {import('jsonwebtoken').Jwt} jwt 
     * @param {string} secret 
     */
	constructor(jwt, secret = process.env.JWT_SECRET){
		/**
         * @private 
         * */
		this.jwt = jwt;

		/**
         * @private
         */
		this.secret = secret;
	}

	/**
	 * @public
	 * @param { UserEntity } user
	 */
	async createToken(user){
		try{
			const token = await this.jwt.sign({ id: user.id }, this.secret, { expiresIn: '0.3h' });
			return token;
		}catch{
			throw new InternalErrorExecption();
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
			throw new UnauthorizedExecption('Missing Bearer Token.');
        
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
			throw new UnauthorizedExecption('Invalid Token.');
		}
	}
}