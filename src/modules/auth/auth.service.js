import { configDotenv } from 'dotenv';
import process from 'process';

configDotenv();

export default class AuthService{
	constructor(jwt, secret = process.env.JWT_SECRET){
		/**
         * @private 
         * @type {jwt}
         * */
		this.jwt = jwt;

		/**
         * @private
         * @type {string}
         */
		this.secret = secret;
	}

	/**
	 * 
	 * @param { UserEntity } user
	 */
	async createToken(user){
		const token = await this.jwt.sign({ id: user.id }, this.secret, { expiresIn: '0.3h' });
		return token;
	}

	/**
     * @private
     * @param {string} authorizationHeader
     * @returns {string}
     */
	getTokenFromHeader(authorizationHeader){
		const token = authorizationHeader.split(' ')[1];
		return token;
	}

	/**
     * @private
     * @param {string} token 
     */
	async decodeToken(token){
		const decodedToken = this.jwt.verify(token, this.secret);
		return decodedToken;
	}
}