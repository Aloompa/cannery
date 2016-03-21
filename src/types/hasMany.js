/* @flow */

'use strict';

const MultiModel = require('./multiModel')

class HasMany extends MultiModel {
    getModelStore () {
        this.modelStore = this._parent.findOwnsMany(this.Model).modelStore;
    }
}

module.exports = HasMany;
