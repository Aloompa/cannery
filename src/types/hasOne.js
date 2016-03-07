/* @flow */

'use strict';

const SingleModel = require('./singleModel');

class HasOne extends SingleModel {

    constructor (parentModel: Object, Model: Function, options: { map: string }) {
        super(...arguments);

        if (!options.map) {
            throw new Error('The HasOne type must be mapped to an id field');
        }

        this._map = options.map;
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
            .fetch(this._model, options, (data) => {
                this._fetched = true;
                this._model.apply(data);
            });

        return this;
    }

}

module.exports = HasOne;
