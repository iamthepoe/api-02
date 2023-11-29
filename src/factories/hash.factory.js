import HashService from '../modules/hash/hash.service.js';
import bcrypt from 'bcrypt';

export const CreateHashService = () => {
  return new HashService(bcrypt);
};
