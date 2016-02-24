'use strict';

const MultiModel = require('./multiModel')

class HasMany extends MultiModel {
    constructor (owner, Model, options) {
        super(owner, Model, options);
        this.modelStore = this.owner.findOwnsMany(Model);
    }

    store (response) {
        this.modelStore.store(response);
    }

    fetch (id) {
        this.modelStore.fetch(id);
    }

    requestOne (id, options) {
        this.modelStore.requestOne(id, options);
    }

    requestMany (options) {
        this.modelStore.requestMany(options);
    }
}

module.exports = HasMany;
