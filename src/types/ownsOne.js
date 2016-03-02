/* @flow */

'use strict';

const BaseType = require('./base');

class OwnsOne extends BaseType {

    constructor (parentModel: Object, Model: Function, options: Object = {}) {
        super(parentModel, options);

        this.options = options;
        this._model = new Model(parentModel);
        this._fetched = false;
    }

    get (options): ?Object {
        if (!this._fetched) {
            this._fetched = true;
            this.request();
        }

        return this._model;
    }

    off (): any {
        this._model.off(...arguments);
        return this;
    }

    on (): Function {
        return this._model.on(...arguments);
    }

    emit (): Function {
        this._model.emit(...arguments);
        return this;
    }

    request (options) {
        this._parent
            .getAdapter()
            .fetchWithin(
                this._model.constructor,
                this._parent,
                options,
                (data) => {
                    this._model.apply(data);
                    this._fetched = true;
                }
            );
    }
}

module.exports = OwnsOne;
