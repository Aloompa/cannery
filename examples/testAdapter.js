/* @flow */

const { BaseAdapter } = require('../src/index.js');

class TestAdapter extends BaseAdapter {
    constructor (options: ?Object) {
        super(options);
        this._mockData = {};
        this.clearError();
        this.clearCheck();
    }

    mockData (data: Object): void {
        this._mockData = data;
    }

    mockError (reason: String): void {
        this.mockError = reason;
    }

    clearError (): void {
        this._mockError = null;
    }

    checkRequest (fn: Function): void {
        this._requestCheck = fn;
    }

    clearCheck (): void {
        this._requestCheck = () => { return true; }
    }

    makeRequest (request: Object, callback: Function) {
        this._requestCheck(request);
        callback(this._mockData, this._mockError);
    }
}

module.exports = TestAdapter;
