import { STATUS_CODES } from 'http';

export default class NotFoundException extends Error{
	constructor(message = STATUS_CODES['404']){
		super(message);
		this.code = 404;
	}
}