/* @flow */

'use strict';

const MultiModel = require('./multiModel')

class HasMany extends MultiModel {

    constructor (parentModel: Object, Model: Function, options: ?Object) {
        super(parentModel, Model, options);
        this.modelStore = parentModel.findOwnsMany(Model);
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
