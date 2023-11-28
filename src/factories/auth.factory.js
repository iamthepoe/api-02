import AuthController from '../modules/auth/auth.controller.js';
import AuthService from '../modules/auth/auth.service.js';
import jwt from 'jsonwebtoken';
import { CreateUserService } from './user.factory.js';
import { CreateHashService } from './hash.factory.js';

export const CreateAuthService = ()=>{
	return new AuthService(jwt, CreateUserService(), CreateHashService());
};

export const CreateAuthController = ()=>{
	return new AuthController(CreateAuthService());
};