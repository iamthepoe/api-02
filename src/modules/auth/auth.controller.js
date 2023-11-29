export default class AuthController{
	/**
     * @param {import('./auth.service.js').default} authService 
     */
	constructor(authService){
		/**@private */
		this.authService = authService;
	}

	/**
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
	 **/
	async signIn(req, res){
		try{
			const { email, password } = req.body;

			const response = await this.authService.signIn(email, password);
			return res.status(200).json(response);
		}catch(e){
			this.handleError(e, res);
		}
	}

	/**
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     * @param {import('express').NextFunction} next 
     */
	async authorize(req, res, next){
		try{
			const authHeader = req.headers['authorization'];
			const token = this.authService.getTokenFromHeader(authHeader);

			const payload = await this.authService.decodeToken(token);
			req.payload = payload;
			next();
		}catch(e){
			this.handleError(e, res);
		} 
	}

	/**
     * 
     * @param {Error} exception 
     * @param {import('express').Response} res 
     * @private
     */
	handleError(exception, res){
		return res.status(exception.code).json({ message: exception.message });
	}
}