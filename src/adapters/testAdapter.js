/* @flow */

const BaseAdapter = require('../adapter');

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
        this._mockError = reason;
    }

    clearData () {
        this._mockData = null;
    }

    clearError (): void {
        this._mockError = null;
    }

    checkRequest (fn: Function): void {
        this._requestCheck = fn;
    }

    clearAll () {
        this.clearData();
        this.clearError();
    }

    clearCheck (): void {
        this._requestCheck = () => {
            return true;
        };
    }

    makeRequest (request: Object, callback: Function) {
        this._requestCheck(request);

        if (this._mockData || this._mockError) {
            callback(this._mockData, this._mockError);
        }
    }
}

module.exports = TestAdapter;
