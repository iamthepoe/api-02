/* eslint-disable no-undef */
import { describe, it, beforeEach, mock } from 'node:test';
import AuthService from '../auth.service.js';
import assert from 'assert';
import UnauthorizedException from '../../../server/exceptions/unauthorized.exception.js';
import { randomUUID } from 'crypto';
import InternalErrorException from '../../../server/exceptions/internal-error.exception.js';

const jwtMock = {
  // eslint-disable-next-line no-unused-vars
  verify: (token, secret) => {
    return new Promise((resolve) => {
      resolve({
        id: randomUUID(),
      });
    });
  },
  // eslint-disable-next-line no-unused-vars
  sign: (data, secret, options) => {
    return new Promise((resolve) => {
      resolve('dnspdn-sdawwo-da');
    });
  },
};

const userServiceMock = {
  findByEmail: () => {},
  save: () => {},
};

const hashServiceMock = {
  compare: () => {},
  hash: () => {},
};

describe('AuthService', () => {
  /**
   * @type {AuthService}
   */
  let service;

  beforeEach(() => {
    service = new AuthService(
      jwtMock,
      userServiceMock,
      hashServiceMock,
      'secret'
    );
  });

  it('should sign in with correct email and password', async () => {
    mock.method(service['userService'], 'findByEmail', async () => {
      return {
        _id: randomUUID(),
        email: 'test@example.com',
        password: 'password',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lastLogin: Date.now(),
      };
    });

    mock.method(service.hashService, 'compare', async () => true);

    mock.method(service.userService, 'save', async () => {});

    const email = 'test@example.com';
    const password = 'password123';

    const result = await service.signIn(email, password);

    assert.ok(result);
    assert.strictEqual(typeof result.id, 'string');
    assert.strictEqual(typeof result.createdAt, 'number');
    assert.strictEqual(typeof result.updatedAt, 'number');
    assert.strictEqual(typeof result.lastLogin, 'number');
    assert.ok(result.token);
  });

  it('should throw UnauthorizedException if email is incorrect', async () => {
    mock.method(service.userService, 'findByEmail', async () => {
      throw new Error();
    });

    const email = 'nonexistent@example.com';
    const password = 'password123';

    await assert.rejects(async () => {
      await service.signIn(email, password);
    }, UnauthorizedException);
  });

  it('should throw UnauthorizedException if password is incorrect', async () => {
    mock.method(service.userService, 'findByEmail', async () => {
      return {
        _id: randomUUID(),
        email: 'test@example.com',
        password: await service.hashService.hash('correctpassword'),
      };
    });

    mock.method(service.hashService, 'compare', async () => false);

    const email = 'test@example.com';
    const password = 'incorrectpassword';

    await assert.rejects(async () => {
      await service.signIn(email, password);
    }, UnauthorizedException);
  });

  it('should be defined', () => {
    assert.ok(AuthService);
    assert.ok(service);
  });

  it('should create a new token', async () => {
    const token = await service.createToken({ id: randomUUID() });
    assert.ok(token);
    assert.strictEqual(typeof token, 'string');
  });

  it('should throw if sign method fails', async () => {
    mock.method(
      service['jwt'],
      'sign',
      () => {
        throw new Error();
      },
      { times: 1 }
    );

    try {
      const token = await service.createToken({ id: randomUUID() });
      assert.fail(token);
    } catch (e) {
      assert.ok(e instanceof InternalErrorException);
      assert.strictEqual(e.code, 500);
    }
  });

  it('should get the token from requisition header', () => {
    const req = {
      header: {
        authorization: 'Bearer token',
      },
    };

    const token = service.getTokenFromHeader(req.header.authorization);

    assert.ok(token);
    assert.strictEqual(typeof token, 'string');
    assert.strictEqual(token, 'token');
  });

  it('should throw if token is empty', () => {
    const req = {
      header: {
        authorization: 'Bearer',
      },
    };

    assert.throws(() => {
      service.getTokenFromHeader(req.header.authorization);
    }, UnauthorizedException);
  });

  it('should decode the token', async () => {
    const token = 'mytoken';

    const payload = await service.decodeToken(token);

    assert.ok(payload);
    assert.ok(payload.id);
    assert.strictEqual(typeof payload.id, 'string');
  });

  it('should throw if token is invalid', async () => {
    mock.method(
      service['jwt'],
      'verify',
      () => {
        throw new Error();
      },
      { times: 1 }
    );

    try {
      const token = await service.decodeToken('invalid-token');
      assert.fail(token);
    } catch (e) {
      assert.ok(e instanceof UnauthorizedException);
      assert.strictEqual(e.code, 401);
    }
  });
});
