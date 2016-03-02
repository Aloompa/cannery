/* @flow */

'use strict';

const BaseType = require('./base');

class HasOne extends BaseType {

    constructor (parentModel: Object, Model: Function, options: { map: string }) {
        super(parentModel, options || {});

        this._parent = parentModel;
        this.options = options || {};
        this._map = this.options.map;
        this._ModelConstructor = Model;
        this._model = new Model(parentModel);
    }

    _getId () {
        if (!this._map) {
            return;
        }

        return (typeof this._map.get === 'function') ? this._map.get() : this._map;
    }

    get (): Object {
        this._model.id = this._getId();
        return this._model;
    }

    toJSON (options: Object = {}): any {
        if (options.recursive) {
            return super.toJSON(options);
        }

        return undefined;
    }

}

module.exports = HasOne;
