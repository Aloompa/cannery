/* @flow */

'use strict';

const MultiModel = require('./multiModel')

class HasMany extends MultiModel {

    constructor (parentModel: Object, Model: Function, options: Object = {}) {
        super(...arguments);
        this.modelStore = parentModel.findOwnsMany(Model);
        this._models = {};
    }

    store (response: Array<Object>) {
        this.modelStore.store(response);
    }

    fetch (id: string): any {
        this.modelStore.fetch(id);
    }

    requestOne (id: string, options: ?Object) {
        this.modelStore.requestOne(id, options);
    }

    requestMany (options: ?Object) {
        this.modelStore.requestMany(options);
    }

    add (model: Object, index: ?number): Object {
        if (!this.map) {
            throw new Error('An unmapped OwnsMany cannot be added to');
        }

        this.map.add(model.id, index);

        this.emit('change');
        this.emit('userChange');

        return this;
    }

    all (): Array<Object> {
        return this.map.map((id) => {
            return this.modelStore.get(id);
        }).filter((model) => {
            return model && !model.getState('isDestroyed');
        });
    }

    get (id: string): Object {
        return this.modelStore.get(id);
    }

    remove (model: Object): Object {
        return this._remove(...arguments);
    }

}

module.exports = HasMany;
