/* @flow */

'use strict';

const MultiModel = require('./multiModel')

class HasMany extends MultiModel {

    getModelStore (): Object {
        return this._parent.findOwnsMany(this.Model).modelStore;
    }

    add (model: Object, index: ?Number) {
        if (!this.map) {
            throw new Error('Models cannot be added to an unmapped HasMany.');
        }

        if (!model.id) {
            throw new Error('Models without IDs cannot be added to a HasMany');
        }

        this.modelStore.addExisting(model, model.get('id'));
        this.map.add(model.id, index);
    }

    remove (model: Object) {
        const index = this.map.all().indexOf(model.id);
        this.map.remove(index);
    }
}

module.exports = HasMany;
