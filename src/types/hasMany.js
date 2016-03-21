/* @flow */

'use strict';

const MultiModel = require('./multiModel')

class HasMany extends MultiModel {
    getModelStore () {
        this.modelStore = parentModel.findOwnsMany(Model).modelStore;
    }
}

module.exports = HasMany;
