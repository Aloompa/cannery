/* @flow */

'use strict';

const BaseType = require('./base');

const model = Symbol();

class OwnsOne extends BaseType {
    constructor (owner: Object, Model: Function, options: Object = {}) {
        super(owner, options);
        this.ModelConstructor = Model;
        this.map = options.map;
    }

    get (): Object {
        if (this[model]) {
            return this[model];
        }

        return this.request();
    }
}

module.exports = OwnsOne;
