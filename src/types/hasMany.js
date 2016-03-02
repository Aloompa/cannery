/* @flow */

'use strict';

const MultiModel = require('./multiModel')

class HasMany extends MultiModel {

    constructor (owner: Object,  parent: Object, Model: Function, options: ?Object) {
        super(owner, parent, Model, options);
        this.modelStore = owner.findOwnsMany(Model);
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
}

module.exports = HasMany;
