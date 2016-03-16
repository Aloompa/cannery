/* @flow */

'use strict';

const MultiModel = require('./multiModel')

class HasMany extends MultiModel {

    constructor (parentModel: Object, Model: Function, options: Object = {}) {
        super(...arguments);
        this.modelStore = parentModel.findOwnsMany(Model);
        this._models = {};
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
        const model = this.modelStore._instantiateModel();

        model.getAdapter()
            .findAll(this.Model, this._parent, options, (response, error) => {
                const idKey = this.Model.getFieldId();

                if (response) {
                    this.modelStore.apply(response);

                    this.virtualMap = response.map((item) => {
                        return item[idKey];
                    });

                    this.emit('change');
                }
            });
    }

    add (model: Object, index: ?number): Object {
        if (!this.map) {
            throw new Error('An unmapped HasMany cannot be added to');
        }

        this.map.add(model.id, index);

        this.emit('change');
        this.emit('userChange');

        return this;
    }

    all (): Array<Object> {

        let state = 'loaded';

        if (!this.map && !this.virtualMap) {
            this.virtualMap = [];
            this.requestMany();
            state = 'loading';
        }

        const models = (this.map || this.virtualMap).map((id) => {
            return this.modelStore.get(id);
        }).filter((model) => {
            return model && model.get(model.constructor.getFieldId()) && !model.getState('isDestroyed');
        });

        models.getState = () => {
            return state;
        };

        return models;
    }

    query (options: Object = {}) {
        return this.all();
    }

    get (id: string): Object {
        return this.modelStore.get(id);
    }

    remove (model: Object): Object {
        return this._remove(...arguments);
    }

    refresh () {
        this.modelStore.clear();
        return this;
    }

}

module.exports = HasMany;
