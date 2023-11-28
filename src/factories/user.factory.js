import User from '../models/User.js';
import UserRepository from '../modules/users/user.repository.js';
import UserService from '../modules/users/user.service.js';
import UserController from '../modules/users/user.controller.js';
import { CreateHashService } from './hash.factory.js';
import AuthService from '../modules/auth/auth.service.js';
import jwt from 'jsonwebtoken';

export const CreateUserRepository = ()=>{
	return new UserRepository(User);
};

export const CreateUserService = ()=>{
	const repository = CreateUserRepository();
	const hashService = CreateHashService();

	return new UserService(
		repository,
		hashService,
		new AuthService(jwt, {}, hashService),
	);
};

export const CreateUserController = ()=>{
	return new UserController(CreateUserService());
};