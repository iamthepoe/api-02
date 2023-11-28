import User from '../models/User.js';
import UserRepository from '../modules/users/user.repository.js';
import UserService from '../modules/users/user.service.js';
import UserController from '../modules/users/user.controller.js';
import { CreateHashService } from './hash.factory.js';

export const CreateUserRepository = ()=>{
	return new UserRepository(User);
};

export const CreateUserService = ()=>{
	return new UserService(CreateUserRepository(), CreateHashService());
};

export const CreateUserController = ()=>{
	return new UserController(CreateUserService());
};