/* @flow */

'use strict';

const BaseType = require('./base');

class HasOne extends BaseType {

    constructor (parentModel: Object, Model: Function, options: { map: string }) {
        super(parentModel, options || {});

        if (!options.map) {
            throw new Error('The HasOne type must be mapped to an id field');
        }

        Object.assign(this, {
            _ModelConstructor: Model,
            _model: new Model(parentModel),
            _map: options.map,
            _fetched: false
        }, options);
    }

    getId () {
        if (!this._map) {
            return;
        }

        return (typeof this._map.get === 'function') ? this._map.get() : this._map;
    }

    get (): Object {
        if (!this._fetched) {
            this._model.id = this.getId();
            this.request();
        }

        return this._model;
    }

    toJSON (options: Object = {}): any {
        if (options.recursive) {
            return super.toJSON(options);
        }

        return undefined;
    }

    request (options: Object = {}): Object {
        this._model
            .getAdapter()
            .fetch(this._model, options, this._model.apply);

        return this;
    }

}

module.exports = HasOne;
