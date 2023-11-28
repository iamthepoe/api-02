import { STATUS_CODES } from 'http';

export default class UnauthorizedException extends Error{
	constructor(message = STATUS_CODES['403']){
		super(message);
		this.code = 403;
	}
}