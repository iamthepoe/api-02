import { it, describe, beforeEach, mock } from 'node:test';
import AuthController from '../auth.controller.js';
import assert from 'assert';
import UnauthorizedException from '../../../server/exceptions/unauthorized.exception.js';
import ResponseMock from '../../../utils/response-express.mock.js';

describe('AuthController', () => {
  let controller;
  let res;
  const authServiceMock = {
    signIn: () => {},
    getTokenFromHeader: () => {},
    decodeToken: () => {},
  };

  beforeEach(() => {
    res = new ResponseMock();
    controller = new AuthController(authServiceMock);
  });

  it('should be defined', () => {
    assert.ok(AuthController);
    assert.ok(controller);
  });

  it('should return an error if email and/or password are invalid', async () => {
    const req = {
      body: {
        email: 'email@email.com',
        password: 'password123',
      },
    };

    mock.method(controller['authService'], 'signIn', async () => {
      throw new UnauthorizedException('Email or/and password are incorrect.');
    }, { times: 1 });

    const response = await controller.signIn(req, res);

    assert.ok(response);
    assert.ok(response.body);
    assert.ok(response.body.message);
    assert.ok(response.statusCode);
    assert.strictEqual(response.statusCode, 401);
  });

  it('should sign in successfully and return a token', async () => {
    const req = {
      body: {
        email: 'valid@email.com',
        password: 'validPassword123',
      },
    };

    const token = 'validToken123';

    mock.method(controller['authService'], 'signIn', async () => {
      return { token };
    }, { times: 1 });

    const response = await controller.signIn(req, res);

    assert.ok(response);
    assert.ok(response.body);
    assert.ok(response.body.token);
    assert.ok(response.statusCode);
    assert.strictEqual(response.statusCode, 200);
  });

  it('should authorize successfully and set payload in request', async () => {
    const req = {
      headers: {
        authorization: 'Bearer validToken123',
      },
    };

    const payload = { id: 'userId123' };

    mock.method(controller['authService'], 'getTokenFromHeader', () => 'validToken123', { times: 1 });
    mock.method(controller['authService'], 'decodeToken', async () => payload, { times: 1 });

    const next = () => {};

    await controller.authorize(req, res, next);

    assert.ok(req.payload);
    assert.deepStrictEqual(req.payload, payload);
  });

  it('should return an error if authorization fails', async () => {
    const req = {
      headers: {
        authorization: 'InvalidToken',
      },
    };

    const error = new UnauthorizedException('Unauthorizated.');

    mock.method(controller['authService'], 'getTokenFromHeader', () => 'InvalidToken', { times: 1 });
    mock.method(controller['authService'], 'decodeToken', async () => {
      throw error;
    }, { times: 1 });

    const response = await controller.authorize(req, res, () => {});

    assert.ok(response);
    assert.ok(response.body);
    assert.ok(response.body.message);
    assert.ok(response.statusCode);
    assert.strictEqual(response.statusCode, 401);
    assert.strictEqual(response.body.message, error.message);
  });
});
