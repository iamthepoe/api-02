export default class ResponseMock {
    constructor() {
      this.statusCode = 200;
      this.body = null;
    }
  
    status(code) {
      this.statusCode = code;
      return this;
    }
  
    json(body) {
      this.body = body;
      return this;
    }
  }