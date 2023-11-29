import { it, describe, before, after } from 'node:test';
import assert from 'node:assert';
import process from 'node:process';
import SetupServer from '../src/server/server.js';
import { configDotenv } from 'dotenv';

configDotenv();

const PORT = process.env.SERVER_PORT;

describe('App (e2e)', () => {
  let server = new SetupServer();

  before(() => {
    server.init();
  });

  after(() => {
    server.close();
  });

  it('should be defined', () => {
    assert.ok(server);
  });

  it('should signup an user with success', async () => {
    const user = {
      name: 'João',
      email: 'joao@escribo.com',
      password: 'senhadojoao999',
      phones: [{ ddd: '11', number: '99722821232' }],
    };

    const response = await fetch(`http://localhost:${PORT}/sign-up`, {
      body: JSON.stringify(user),
      method: 'POST',
    });

    assert.ok(response);
    assert.strictEqual(response.status, 201);
  });
});
