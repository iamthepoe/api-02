import User from '../models/User.js';
import UserRepository from '../modules/users/user.repository.js';
import UserService from '../modules/users/user.service.js';
import UserController from '../modules/users/user.controller.js';

export const CreateUserRepository = ()=>{
	return new UserRepository(User);
};

export const CreateUserService = ()=>{
	return new UserService(CreateUserRepository());
};

export const CreateUserController = ()=>{
	return new UserController(CreateUserService());
};