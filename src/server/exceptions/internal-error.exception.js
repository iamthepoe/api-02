import { STATUS_CODES } from 'http';

export default class InternalErrorException extends Error{
	constructor(message = STATUS_CODES['500']){
		super(message);
		this.code = 500;
	}
}