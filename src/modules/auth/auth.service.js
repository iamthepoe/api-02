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