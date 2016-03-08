/* @flow */

'use strict';

const BaseType = require('./base');

class OwnsOne extends BaseType {

    constructor (parentModel: Object, Model: Function, options: Object = {}) {
        super(...arguments);

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

    request (options: ?Object = {}): Object {
        this._parent
            .getAdapter()
            .fetchWithin(
                this._ModelConstructor,
                this._parent,
                options,
                (data) => {
                    this._model.apply(data);
                    this._fetched = true;
                }
            );

        return this;
    }

    apply (data: Object): Object {
        this._model.apply(data);
        return this;
    }

}

module.exports = OwnsOne;
