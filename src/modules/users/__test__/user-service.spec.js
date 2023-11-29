/* eslint-disable no-undef */
import { it, describe, beforeEach, mock } from 'node:test';
import UserService from '../user.service.js';
import assert from 'assert';
import { randomUUID } from 'crypto';
import BadRequestException from '../../../server/exceptions/bad-request.exception.js';
import NotFoundException from '../../../server/exceptions/not-found.exception.js';
import InternalErrorException from '../../../server/exceptions/internal-error.exception.js';

const userRepositoryMock = {
  findByEmail: () => {},
  findById: () => {},
  create: (user) => {
    return new Promise((resolve) => {
      resolve({
        _id: randomUUID(),
        ...user,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lastLogin: Date.now(),
      });
    });
  },
  save: () => {},
};

const hashServiceMock = {
  hash: (value) => {
    return new Promise((resolve) => resolve(value));
  },
};

const authServiceMock = {
  // eslint-disable-next-line no-unused-vars
  createToken: (payload) => {
    return new Promise((resolve) => resolve('token'));
  },
};

describe('UserService', () => {
  /** @type {UserService} */
  let service;

  beforeEach(() => {
    service = new UserService(
      userRepositoryMock,
      hashServiceMock,
      authServiceMock
    );
  });

  it('should be defined', () => {
    assert.ok(UserService);
  });

  describe('create', () => {
    it('should create an user with success', async () => {
      const user = await service.create({
        name: 'Leonardo',
        email: 'leonardo@escribo.com',
        password: 'strong@password333',
        phones: [{ number: '99821321', ddd: '13' }],
      });

      assert.ok(user);
      assert.ok(user.id);
      assert.ok(user.lastLogin);
      assert.ok(user.createdAt);
      assert.ok(user.updatedAt);
    });

    it('should reject if email is already in use', async () => {
      const userWithTheSameEmail = {
        name: 'Leonardo',
        email: 'leonardo@escribo.com',
        password: 'strong@password333',
        phones: [{ number: '99821321', ddd: '13' }],
      };

      mock.method(service['repository'], 'findByEmail', () => {
        return new Promise((resolve) => {
          resolve({
            name: 'Leonardo',
            email: 'leonardo@escribo.com',
            password: 'strong@password333',
            phones: [{ number: '99821321', ddd: '13' }],
          });
        });
      });

      try {
        const user = await service.create(userWithTheSameEmail);
        assert.fail(user);
      } catch (exception) {
        assert.ok(exception instanceof BadRequestException);
        assert.strictEqual(exception.code, 400);
      }
    });

    it('should reject if email is invalid', async () => {
      const userWithInvalidEmail = {
        name: 'Leonardo',
        email: 'leonardo',
        password: 'strong@password333',
        phones: [{ number: '99821321', ddd: '13' }],
      };

      try {
        const user = await service.create(userWithInvalidEmail);
        assert.fail(user);
      } catch (exception) {
        assert.ok(exception instanceof BadRequestException);
        assert.strictEqual(exception.code, 400);
      }
    });

    it('should reject if phone is invalid', async () => {
      const userWithInvalidPhone = {
        name: 'Leonardo',
        email: 'leonardo@escribo.com',
        password: 'strong@password333',
        phones: [{ number: 'numero', ddd: 'errado' }],
      };

      try {
        const user = await service.create(userWithInvalidPhone);
        assert.fail(user);
      } catch (exception) {
        assert.ok(exception instanceof BadRequestException);
        assert.strictEqual(exception.code, 400);
      }
    });

    it('should reject if password length is less-than 8', async () => {
      const userWithInvalidPassword = {
        name: 'Leonardo',
        email: 'leonardo@escribo.com',
        password: '123',
        phones: [{ number: '84929121', ddd: '11' }],
      };

      try {
        const user = await service.create(userWithInvalidPassword);
        assert.fail(user);
      } catch (exception) {
        assert.ok(exception instanceof BadRequestException);
        assert.strictEqual(exception.code, 400);
      }
    });
  });

  describe('findBy', () => {
    it('should return a 404 if email does not exist.', async () => {
      mock.method(service['repository'], 'findByEmail', () => {
        return null;
      });

      try {
        const user = await service.findByEmail('some@email.com');
        assert.fail(user);
      } catch (e) {
        assert.ok(e instanceof NotFoundException);
        assert.strictEqual(e.code, 404);
      }
    });

    it('should return a 404 if id does not exist.', async () => {
      mock.method(service['repository'], 'findById', () => {
        return null;
      });

      try {
        const user = await service.findById('someid');
        assert.fail(user);
      } catch (e) {
        assert.ok(e instanceof NotFoundException);
        assert.strictEqual(e.code, 404);
      }
    });
  });

  describe('save', () => {
    it('should throw a internal error if save fails', async () => {
      mock.method(service['repository'], 'save', () => {
        throw new Error();
      });

      try {
        const savedUser = await service.save('something');
        assert.fail(savedUser);
      } catch (e) {
        assert.ok(e instanceof InternalErrorException);
        assert.strictEqual(e.code, 500);
      }
    });
  });
});
