/* @flow */

'use strict';

const BaseType = require('./base');

class OwnsOne extends BaseType {

    constructor (parentModel: Object, Model: Function, options: Object = {}) {
        super(...arguments);

        Object.assign(this, {
            _ModelConstructor: Model,
            _parent: parentModel
        });
    }

    _createModel () {
        this._model = new this._ModelConstructor(this._parent);
    }

    get (): ?Object {
        if (!this._model) {
            this._createModel();
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
        if (!this._model) {
            this._createModel();
        }

        this._model.apply(data);
        
        return this;
    }

}

module.exports = OwnsOne;
