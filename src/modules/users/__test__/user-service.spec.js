import {it, describe, beforeEach, mock} from 'node:test';
import UserService from '../user.service.js';
import assert from 'assert';
import { randomUUID } from 'crypto';
import BadRequestException from '../../../server/exceptions/bad-request.exception.js';

const userRepositoryMock = {
	findByEmail: ()=>{},
	create: (user)=>{
		return new Promise((resolve)=>{
			resolve({
				_id: randomUUID(),
				...user,
				createdAt: Date.now(), 
				updatedAt: Date.now(),
				lastLogin: Date.now()
			});
		});
	}
};

describe('UserService', ()=>{
	/** @type {UserService} */
	let service;

	beforeEach(()=>{
		service = new UserService(userRepositoryMock);
	});

	it('should be defined', ()=>{
		assert.ok(UserService);
	});

	describe('create', ()=>{
		it('should create an user with success', async ()=>{
			const user = await service.create({
				name: 'Leonardo',
				email: 'leonardo@escribo.com',
				password: 'strong@password333',
				phones: [{number: '99821321', ddd: '13'}]
			});
    
			assert.ok(user);
			assert.ok(user.id);
			assert.ok(user.lastLogin);
			assert.ok(user.createdAt);
			assert.ok(user.updatedAt);
		});
    
		it('should reject if email is already in use', async ()=>{
			const userWithTheSameEmail = {
				name: 'Leonardo',
				email: 'leonardo@escribo.com',
				password: 'strong@password333',
				phones: [{number: '99821321', ddd: '13'}]
			};
    
			mock.method(service['repository'], 'findByEmail', ()=>{
				return new Promise((resolve)=>{
					resolve({
						name: 'Leonardo',
						email: 'leonardo@escribo.com',
						password: 'strong@password333',
						phones: [{number: '99821321', ddd: '13'}]
					});
				});
			});
            
			try{
				const user = await service.create(userWithTheSameEmail);
				assert.fail(user);
			}catch(exception){
				assert.ok(exception instanceof BadRequestException);
				assert.strictEqual(exception.code, 400);
			}
    
		});
    
		it('should reject if email is invalid', async ()=>{
			const userWithInvalidEmail = {
				name: 'Leonardo',
				email: 'leonardo',
				password: 'strong@password333',
				phones: [{number: '99821321', ddd: '13'}]
			};
    
			try{
				const user = await service.create(userWithInvalidEmail);
				assert.fail(user);
			}catch(exception){
				assert.ok(exception instanceof BadRequestException);
				assert.strictEqual(exception.code, 400);
			}
    
		});
    
		it('should reject if phone is invalid', async ()=>{
			const userWithInvalidPhone = {
				name: 'Leonardo',
				email: 'leonardo@escribo.com',
				password: 'strong@password333',
				phones: [{number: 'numero', ddd: 'errado'}]
			};
    
			try{
				const user = await service.create(userWithInvalidPhone);
				assert.fail(user);
			}catch(exception){
				assert.ok(exception instanceof BadRequestException);
				assert.strictEqual(exception.code, 400);
			}
    
		});
    
		it('should reject if password length is less-than 8', async ()=>{
			const userWithInvalidPassword = {
				name: 'Leonardo',
				email: 'leonardo@escribo.com',
				password: '123',
				phones: [{number: '84929121', ddd: '11'}]
			};
    
			try{
				const user = await service.create(userWithInvalidPassword);
				assert.fail(user);
			}catch(exception){
				assert.ok(exception instanceof BadRequestException);
				assert.strictEqual(exception.code, 400);
			}
    
		});
	});
});