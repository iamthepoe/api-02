import { it, describe, before, after } from 'node:test';
import assert from 'node:assert';
import process from 'node:process';

import SetupServer from '../src/server/server.js';
import { configDotenv } from 'dotenv';
import { randomUUID } from 'node:crypto';

configDotenv();

const PORT = process.env.SERVER_PORT;
const URL = `http://localhost:${PORT}`;

describe('App (e2e)', () => {
  let server;

  const createdUser = {
    name: `John ${randomUUID()}`,
    email: `${randomUUID()}@${randomUUID()}.com`,
    password: `@${randomUUID()}@`,
    phones: [{ ddd: '11', number: '997882213' }],
  };

  let token = '';

  before(async () => {
    server = new SetupServer();
    await server.init();
  });

  after(async () => {
    await server.close();
  });

  it('should be defined', () => {
    assert.ok(server);
  });

  describe('POST /sign-up', () => {
    it('should create an user with success', async () => {
      const response = await fetch(`${URL}/sign-up`, {
        body: JSON.stringify({ ...createdUser }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      assert.ok(response);
      assert.ok(data);

      assert.strictEqual(response.status, 201);
      assert.ok(data.id);
      assert.ok(data.createdAt);
      assert.ok(data.updatedAt);
      assert.ok(data.lastLogin);
      assert.ok(data.token);

      token = data.token;
    });

    it('should reject if email is already in use', async () => {
      const response = await fetch(`${URL}/sign-up`, {
        body: JSON.stringify({ ...createdUser }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      assert.ok(response);
      assert.ok(data);

      assert.strictEqual(response.status, 400);
      assert.strictEqual(data.message, 'Email is already in use');
    });
  });

  describe('POST /sign-in', () => {
    it('should sign-in an user with success', async () => {
      const response = await fetch(`${URL}/sign-in`, {
        body: JSON.stringify({
          email: createdUser.email,
          password: createdUser.password,
        }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      assert.ok(response);
      assert.strictEqual(response.status, 200);
      assert.ok(data);
      assert.ok(data.id);
      assert.ok(data.createdAt);
      assert.ok(data.updatedAt);
      assert.ok(data.lastLogin);
      assert.ok(data.token);

      token = data.token;
    });

    it('should return 401 if password is incorrect', async () => {
      const response = await fetch(`${URL}/sign-in`, {
        body: JSON.stringify({
          email: createdUser.email,
          password: '21302312412',
        }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      assert.ok(response);
      assert.ok(data);
      assert.strictEqual(response.status, 401);
      assert.strictEqual(data.message, 'Email or/and password are incorrect.');
    });

    it('should return 401 if email is incorrect', async () => {
      const response = await fetch(`${URL}/sign-in`, {
        body: JSON.stringify({
          email: 'wrong@email.com',
          password: createdUser.password,
        }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      assert.ok(response);
      assert.ok(data);
      assert.strictEqual(response.status, 401);
      assert.strictEqual(data.message, 'Email or/and password are incorrect.');
    });

    it('should return 401 if email dont exist', async () => {
      const response = await fetch(`${URL}/sign-in`, {
        body: JSON.stringify({
          email: 'email@quenaoexiste.inexistente',
          password: '21302312412',
        }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      assert.ok(response);
      assert.ok(data);
      assert.strictEqual(response.status, 401);
      assert.strictEqual(data.message, 'Email or/and password are incorrect.');
    });
  });

  describe('GET /missing-route', () => {
    it('should return 404', async () => {
      const response = await fetch(`${URL}/missing-route`);
      const data = await response.json();

      assert.ok(response);
      assert.ok(data);
      assert.strictEqual(response.status, 404);
      assert.strictEqual(data.message, 'Not Found');
    });
  });

  describe('GET /user', () => {
    it('should get information from user', async () => {
      const response = await fetch(`${URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      assert.ok(response);
      assert.ok(data);
      assert.strictEqual(response.status, 200);
    });

    it('should return 401 if token is invalid', async () => {
      const response = await fetch(`${URL}/user`, {
        headers: {
          Authorization: 'Bearer invalidtoken',
        },
      });

      const data = await response.json();

      assert.ok(response);
      assert.ok(data);
      assert.strictEqual(response.status, 401);
      assert.strictEqual(data.message, 'Unauthorizated.');
    });

    it('should return 401 if token dont exist', async () => {
      const response = await fetch(`${URL}/user`);
      const data = await response.json();

      assert.ok(response);
      assert.ok(data);
      assert.strictEqual(response.status, 401);
      assert.strictEqual(data.message, 'Missing Bearer Token.');
    });
  });
});
