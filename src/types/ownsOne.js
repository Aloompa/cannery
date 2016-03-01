/* @flow */

'use strict';

const BaseType = require('./base');

class OwnsOne extends BaseType {

    constructor (owner: Object, parent: Object, Model: Function, options: Object = {}) {
        super(owner, options);

        if (!options.map) {
            throw new Error('The OwnsOne type must be mapped to an id field');
        }

        Object.assign(this, {
            _model: new Model(),
            _fetched: false
        }, options);
    }

    get (): ?Object {
        if (!this._fetched) {
            this._fetched = true;
            this._model._owner = this.owner;
            this._model.id = this.map.get();
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

    request () {
        this._model.getAdapter().fetch(this._model, {}, (response) => {
            this._model.apply(response);
        });
    }
}

module.exports = OwnsOne;
