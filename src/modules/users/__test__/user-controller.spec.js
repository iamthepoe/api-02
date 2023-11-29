import { it, describe, beforeEach, mock } from 'node:test';
import UserController from '../user.controller.js';
import assert from 'assert';
import ResponseMock from '../../../utils/response-express.mock.js';
import InternalErrorException from '../../../server/exceptions/internal-error.exception.js';
import NotFoundException from '../../../server/exceptions/not-found.exception.js';

describe('UserController', () => {
  let controller;
  let res;
  const userServiceMock = {
    create: () => {},
    findById: () => {},
  };

  beforeEach(() => {
    res = new ResponseMock();
    controller = new UserController(userServiceMock);
  });

  it('should be defined', () => {
    assert.ok(UserController);
    assert.ok(controller);
  });

  it('should create a new user successfully', async () => {
    const req = {
      body: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        phones: [{ ddd: '11', number: '987654321' }],
      },
    };

    const createdUser = {
      id: 'userId123',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phones: [{ ddd: '11', number: '987654321' }],
    };

    mock.method(controller['service'], 'create', async () => createdUser, { times: 1 });

    const response = await controller.create(req, res);

    assert.ok(response);
    assert.ok(response.body);
    assert.strictEqual(response.statusCode, 201);
    assert.deepStrictEqual(response.body, createdUser);
  });

  it('should return an error if user creation fails', async () => {
    const req = {
      body: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        phones: [{ ddd: '11', number: '987654321' }],
      },
    };

    const internalError = new InternalErrorException('Internal Error');

    mock.method(controller['service'], 'create', async () => {
      throw internalError;
    }, { times: 1 });

    const response = await controller.create(req, res);

    assert.ok(response);
    assert.ok(response.body);
    assert.strictEqual(response.statusCode, 500);
    assert.strictEqual(response.body.message, internalError.message);
  });

  it('should find user by token successfully', async () => {
    const req = {
      payload: {
        id: 'userId123',
      },
    };

    const foundUser = {
      _id: 'userId123',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phones: [{ ddd: '11', number: '987654321' }],
    };

    mock.method(controller['service'], 'findById', async () => foundUser, { times: 1 });

    const response = await controller.findByToken(req, res);

    assert.ok(response);
    assert.ok(response.body);
    assert.strictEqual(response.statusCode, 200);
    assert.deepStrictEqual(response.body, {
      id: 'userId123',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phones: [{ ddd: '11', number: '987654321' }],
    });
  });

  it('should return an error if user retrieval by token fails', async () => {
    const req = {
      payload: {
        id: 'userId123',
      },
    };

    const error = new Error('User retrieval failed');
    error.code = 500;

    mock.method(controller['service'], 'findById', async () => {
      throw error;
    }, { times: 1 });

    const response = await controller.findByToken(req, res);

    assert.ok(response);
    assert.ok(response.body);
    assert.strictEqual(response.statusCode, 500);
    assert.strictEqual(response.body.message, error.message);
  });

  it('should return a 404 error if user is not found by token', async () => {
    const req = {
      payload: {
        id: 'nonExistentUserId',
      },
    };

    mock.method(controller['service'], 'findById', async () => {
      throw new NotFoundException('User not found.');
    }, { times: 1 });

    const response = await controller.findByToken(req, res);

    assert.ok(response);
    assert.strictEqual(response.statusCode, 404);
    assert.strictEqual(response.body.message, 'User not found.');
  });
});
