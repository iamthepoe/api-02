import { STATUS_CODES } from 'http';

export default class BadRequestException extends Error{
	constructor(message = STATUS_CODES['400']){
		super(message);
		this.code = 400;
	}
}