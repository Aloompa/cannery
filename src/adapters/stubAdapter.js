/* @flow */

const BaseAdapter = require('../adapter');

class StubAdapter extends BaseAdapter {

    makeRequest (request: Object, callback: Function) {
    }
}

module.exports = StubAdapter;
