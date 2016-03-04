/* @flow */

'use strict';

const MultiModel = require('./multiModel')

class HasMany extends MultiModel {

    constructor (parentModel: Object, Model: Function, options: ?Object) {
        super(...arguments);
        this.modelStore = parentModel.findOwnsMany(Model);
    }

    on (action: string, callback: Function) {
        this._listeners[action] = [];
        this._listeners[action].callback = callback;
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
        super.add(...arguments);
        this.modelStore.add(model);
        return this;
    }

    all (options: Object = {}): Array<Object> {
        return this.map.map((id) => {
            return this.modelStore.get(id);
        }).filter((model) => {
            return model;
        });
    }

    get (id: string): Object {
        return this.modelStore.get(id);
    }

}

module.exports = HasMany;
