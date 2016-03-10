/* @flow */

'use strict';

const BaseType = require('./base');

class HasOne extends BaseType {

    constructor (parentModel: Object, Model: Function, options: Object = {}) {
        super(...arguments);

        if (!options.map) {
            throw new Error('The HasOne type must be mapped to an id field');
        }

        Object.assign(this, {
            modelStore: parentModel.findOwnsMany(Model),
            _map: options.map
        });
    }

    get (): Object {
        return this.modelStore.get(this._map.get());
    }

}

module.exports = HasOne;
