import { describe, it } from 'node:test';
import HashService from '../hash.service.js';
import assert from 'assert';

describe('HashService', () => {
  it('should be defined', () => {
    const hashService = new HashService({
      hash: async (text, rounds) => `hashed:${text}:${rounds}`,
      compare: async (text, hash) => hash === `hashed:${text}`,
    });

    assert.ok(HashService);
    assert.ok(hashService);
  });

  it('should hash text with default rounds', async () => {
    const hashService = new HashService({
      hash: async (text, rounds) => `hashed:${text}:${rounds}`,
    });

    const text = 'password';

    const hashedText = await hashService.hash(text);

    assert.ok(hashedText);
    assert.strictEqual(typeof hashedText, 'string');
    assert.strictEqual(hashedText, `hashed:${text}:10`);
  });

  it('should hash text with specified rounds', async () => {
    const hashService = new HashService({
      hash: async (text, rounds) => `hashed:${text}:${rounds}`,
    });

    const text = 'password';
    const rounds = 15;

    const hashedText = await hashService.hash(text, rounds);

    assert.ok(hashedText);
    assert.strictEqual(typeof hashedText, 'string');
    assert.strictEqual(hashedText, `hashed:${text}:${rounds}`);
  });

  it('should compare text and hash correctly', async () => {
    const hashService = new HashService({
      compare: async (text, hash) => hash === `hashed:${text}`,
    });

    const text = 'password';
    const hash = 'hashed:password';

    const result = await hashService.compare(text, hash);

    assert.ok(result);
    assert.strictEqual(typeof result, 'boolean');
    assert.strictEqual(result, true);
  });

  it('should return false when comparing incorrect text and hash', async () => {
    const hashService = new HashService({
      compare: async (text, hash) => hash === `hashed:${text}`,
    });

    const text = 'password';
    const hash = 'incorrectHash';

    const result = await hashService.compare(text, hash);

    assert.ok(!result);
    assert.strictEqual(typeof result, 'boolean');
    assert.strictEqual(result, false);
  });
});
