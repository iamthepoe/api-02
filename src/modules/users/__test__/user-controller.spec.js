import { it, describe, beforeEach } from 'node:test';
import assert from 'assert';
import UserController from '../user.controller.js';
import { randomUUID } from 'crypto';

const userServiceMock = {
	// eslint-disable-next-line no-unused-vars
	create: (user)=>{
		return new Promise((resolve)=>{
			resolve({
				id: randomUUID(),
				createdAt: Date.now(),
				updatedAt: Date.now(),
				lastLogin: Date.now(),
				token: null
			});
		});
	}
};



describe('UserController', ()=>{	
	/**
     * @type {UserController}
     */
	let controller;

	beforeEach(()=>{
		controller = new UserController(userServiceMock);
	});

	it('should be defined', ()=>{
		assert.ok(UserController);
	});

	/*it('should create an user with success', async ()=>{
		const req = {
			body: {
                	name: 'Leonardo',
                	email: 'leonardo@escribo.com',
                	password: 'strong@password333',
                	phones: [{number: '99821321', ddd: '13'}]
			}
		};

		const response = await controller.create(req, {});
	});*/
});