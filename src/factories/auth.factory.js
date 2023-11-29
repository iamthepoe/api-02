import AuthController from '../modules/auth/auth.controller.js';
import AuthService from '../modules/auth/auth.service.js';
import jwt from 'jsonwebtoken';
import { CreateHashService } from './hash.factory.js';
import UserService from '../modules/users/user.service.js';
import { CreateUserRepository } from './user.factory.js';

export const CreateAuthService = () => {
  const repository = CreateUserRepository();
  const hashService = CreateHashService();

  return new AuthService(
    jwt,
    new UserService(repository, hashService),
    hashService
  );
};

export const CreateAuthController = () => {
  return new AuthController(CreateAuthService());
};
