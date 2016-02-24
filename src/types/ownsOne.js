'use strict';

const BaseType = require('./base');

const model = Symbol();

class OwnsOne extends BaseType {
    constructor (owner, Model, options) {
        super(owner, options);
        this.ModelConstructor = Model;
        this.map = options.map;
    }

    get () {
        if (this[model]) {
            return this[model];
        }

        return this.request();
    }
}

module.exports = OwnsOne;
