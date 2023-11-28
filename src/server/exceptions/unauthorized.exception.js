import { STATUS_CODES } from 'http';

export default class UnauthorizedException extends Error{
	constructor(message = STATUS_CODES['401']){
		super(message);
		this.code = 401;
	}
}