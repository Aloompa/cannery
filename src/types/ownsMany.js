/* @flow */

'use strict';

const MultiModel = require('./multiModel');
const ModelStore = require('../util/modelStore');

class OwnsMany extends MultiModel {
    getModelStore () {
        return new ModelStore(this.Model, this._parent);
    }

    // Override
    toJSON (options: Object = {}) {
        if (options.recursive) {
            return this.modelStore.all().map((model) => {
                return model.toJSON(options);
            });
        }
    }

    _handleEvent (event, ...args) {
        this.emit(event, ...args);
    }
}

module.exports = OwnsMany;
