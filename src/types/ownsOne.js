/* @flow */

'use strict';

const BaseType = require('./base');

class OwnsOne extends BaseType {

    constructor (parentModel: Object, Model: Function, options: Object = {}) {
        super(parentModel, options);

        Object.assign(this, {
            _ModelConstructor: Model,
            _model: new Model(parentModel),
            _fetched: false
        });
    }

    get (): ?Object {
        if (!this._fetched) {
            this._fetched = true;
            this._model._parent = this._parent;
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

    request (options: Object = {}): Object {
        this._model
            .getAdapter()
            .fetchWithin(this._ModelConstructor, this._parent, options, this._model.apply);

        return this;
    }
}

module.exports = OwnsOne;
