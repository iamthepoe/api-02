/* eslint-disable no-undef */
import { it, describe, beforeEach, mock } from 'node:test';
import assert from 'assert';
import UserRepository from '../user.repository.js';
import { randomUUID } from 'crypto';

const userModelMock = {
  create: (user) => {
    return new Promise((resolve) => {
      resolve({
        ...user,
        id: randomUUID(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lastLogin: Date.now(),
      });
    });
  },
  findOne: () => {},
  findOneAndUpdate: () => {},
};

describe('UserRepository', () => {
  /**
   * @type {UserRepository}
   */
  let repository;

  /**
   * @type {UserEntity}
   */
  let createdUser;

  beforeEach(() => {
    repository = new UserRepository(userModelMock);
  });

  it('should be defined', () => {
    assert.ok(UserRepository);
  });

  it('should create an user with success', async () => {
    const user = await repository.create({
      name: 'Leonardo',
      email: 'leonardo@escribo.com',
      password: 'strongpassword',
      phones: [{ ddd: '11', number: '997872222' }],
    });

    assert.ok(user);
    assert.ok(user.name);
    assert.ok(user.email);
    assert.ok(user.password);
    assert.ok(user.phones);
    assert.ok(user.phones[0].ddd);
    assert.ok(user.phones[0].number);
    assert.ok(user.lastLogin);
    assert.strictEqual(typeof user.name, 'string');
    assert.strictEqual(typeof user.email, 'string');
    assert.strictEqual(typeof user.password, 'string');
    assert.strictEqual(typeof user.phones, 'object');
    assert.strictEqual(typeof user.phones[0].ddd, 'string');
    assert.strictEqual(typeof user.phones[0].number, 'string');
    assert.strictEqual(typeof user.lastLogin, 'number');

    createdUser = user;
  });

  it('should find an user by email', async () => {
    // eslint-disable-next-line no-unused-vars
    mock.method(repository['model'], 'findOne', (query) => {
      return new Promise((resolve) => {
        resolve({
          ...createdUser,
        });
      });
    });

    const userWithCurrentEmail = await repository.findByEmail({
      email: createdUser.email,
    });

    assert.ok(userWithCurrentEmail.email);
    assert.strictEqual(userWithCurrentEmail.email, createdUser.email);
  });

  it('should find an user by id', async () => {
    const userWithCurrentId = await repository.findById({
      id: createdUser.id,
    });

    assert.ok(userWithCurrentId.id);
    assert.strictEqual(userWithCurrentId.id, createdUser.id);
  });

  it('should save an user', async () => {
    // eslint-disable-next-line no-unused-vars
    mock.method(repository['model'], 'findOneAndUpdate', (query, value) => {
      return new Promise((resolve) => {
        resolve({
          ...createdUser,
        });
      });
    });
    createdUser.lastLogin = Date.now();
    const savedUser = await repository.save(createdUser);
    assert.ok(savedUser);
    assert.strictEqual(savedUser.lastLogin, createdUser.lastLogin);
  });
});
