/* @flow */

'use strict';

const MultiModel = require('./multiModel')

class HasMany extends MultiModel {
    getModelStore () {
        return this._parent.findOwnsMany(this.Model).modelStore;
    }
}

module.exports = HasMany;
