import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert';
import SetupServer from '../server.js';

const appMock = {
	listen: (port) => { 
		console.log(port);
		return {
			close: ()=> {
				return 1;
			}
		};
	}
};

describe('Server', ()=>{
	/**
     * @type {SetupServer}
     */
	let app;

	beforeEach(()=>{
		app = new SetupServer(appMock, 3333);
	});

	it('should be defined', ()=> {
		assert.ok(app);
		assert.ok(app.init);
	});

	it('should init with success', ()=>{
		assert.ok(app.init());
	});
    
	it('should catch the error', ()=>{
		mock.method(app.app, 'listen', ()=>{
			throw new Error();
		});

		const response = app.init();
        
		assert.ok(response.message);
		assert.ok(response.exception);
	});

	it('should close with success', ()=>{
		app['server'] = { close: ()=>{} };
		mock.method(app['server'], 'close', ()=> {return 1;});
		assert.strictEqual(app.close(), 1);
	});
});