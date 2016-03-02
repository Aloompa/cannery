/* @flow */

'use strict';

const BaseType = require('./base');

class OwnsOne extends BaseType {

    constructor (parentModel: Object, Model: Function, options: Object = {}) {
        super(parentModel, options);

        this.options = options;
        this._model = new Model();
        this._fetched = false;

        if (options.map) {
            this.map = this.owner.get(options.map);
        }
    }

    get (): ?Object {
        if (!this._fetched) {
            this._fetched = true;
            this._model._owner = this._parent;
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
