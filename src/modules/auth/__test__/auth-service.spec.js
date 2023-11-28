import { describe, it, beforeEach, mock } from 'node:test';
import AuthService from '../auth.service.js';
import assert from 'assert';
import UnauthorizedException from '../../../server/exceptions/unauthorized.exception.js';
import { randomUUID } from 'crypto';
import InternalErrorException from '../../../server/exceptions/internal-error.exception.js';


const jwtMock = {
	// eslint-disable-next-line no-unused-vars
	verify: (token, secret)=>{
		return new Promise((resolve)=>{
			resolve({
				id: randomUUID()
			});
		});
	},
	// eslint-disable-next-line no-unused-vars
	sign: (data, secret, options)=>{
		return new Promise((resolve)=>{
			resolve('dnspdn-sdawwo-da');
		});
	}
};

describe('AuthService', ()=>{
	/**
     * @type {AuthService}
     */
	let service;

	beforeEach(()=>{
		service = new AuthService(jwtMock, 'secret');    
	});

	it('should be defined', ()=>{
		assert.ok(AuthService);
		assert.ok(service);
	});

	it('should create a new token', async ()=>{
		const token = await service.createToken({ id: randomUUID() });
		assert.ok(token);
		assert.strictEqual(typeof token, 'string');
	});

	it('should throw if sign method fails', async ()=>{
		mock.method(service['jwt'], 'sign', ()=>{
			throw new Error();
		}, {times: 1});

		try{
			const token = await service.createToken({ id: randomUUID() });
			assert.fail(token);
		}catch(e){
			assert.ok(e instanceof InternalErrorException);
			assert.strictEqual(e.code, 500);
		}
	});

	it('should get the token from requisition header', ()=>{
		const req = {
			header: {
				authorization: 'Bearer token'
			}
		};

		const token = service.getTokenFromHeader(req.header.authorization);

		assert.ok(token);
		assert.strictEqual(typeof token, 'string');
		assert.strictEqual(token, 'token');
	});

	it('should throw if token is empty', ()=>{
		const req = {
			header: {
				authorization: 'Bearer'
			}
		};

		assert.throws(()=>{
			service.getTokenFromHeader(req.header.authorization);
		}, UnauthorizedException);
	});

	it('should decode the token', async ()=>{
		const token = 'mytoken';

		const payload = await service.decodeToken(token);

		assert.ok(payload);
		assert.ok(payload.id);
		assert.strictEqual(typeof payload.id, 'string');
	});

	it('should throw if token is invalid', async ()=>{
		mock.method(service['jwt'], 'verify', ()=>{
			throw new Error();
		}, {times: 1});

		try{
			const token = await service.decodeToken('invalid-token');
			assert.fail(token);
		}catch(e){
			assert.ok(e instanceof UnauthorizedException);
			assert.strictEqual(e.code, 403);
		}
	});
});