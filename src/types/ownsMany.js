/* @flow */

'use strict';

const MultiModel = require('./multiModel');
const ModelStore = require('../util/modelStore');

class OwnsMany extends MultiModel {
    getModelStore () {
        return new ModelStore(this.Model, this._parent);
    }
}

module.exports = OwnsMany;
