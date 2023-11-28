import { it, describe, before, after } from 'node:test';
import assert from 'node:assert';
import SetupServer from '../src/server/server.js';

describe('App (e2e)', ()=>{
	let server = new SetupServer();

	before(()=>{
		server.init();
	});

	after(()=>{
		server.close();
	});

	it('should be defined', ()=>{
		assert.ok(server);
	});
});