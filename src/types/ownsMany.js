/* @flow */

'use strict';

const MultiModel = require('./multiModel');
const RequestCache = require('../util/requestCache');

class OwnsMany extends MultiModel {

    constructor () {
        super(...arguments);

        this.requestCache = new RequestCache();
        this._models = {};
    }

    _instantiateModel (id: ?string): Object {
        const { Model } = this;
        return new Model(this._parent, id, this.options.modelOptions);
    }

    _getModelById (id: string): Object {
        return this._models[id];
    }

    create (): Object {
        return this._instantiateModel();
    }

    // @override
    requestOne (id: string, options: ?Object): any {
        let model = this._getModelById(id);

        if (!model) {
            model = this._instantiateModel(id);
        }

        model.getAdapter().fetch(model, options, (response) => {
            this.apply([response]);
            this.emit('change');
        });

        return model;
    }

    // @override
    requestMany (options: Object = {}): any {
        const model = this._instantiateModel();

        model
            .getAdapter()
            .findAll(this.Model, this._parent, options, (response) => {
                this.apply(response);
                this.applyQueryResults(response, options);
                this.emit('change');
            });

        return this;
    }

    apply (data : Array<Object>): Object {
        data.forEach((item) => {
            this._models[item.id] = this._models[item.id] || this._instantiateModel();
            this._models[item.id].apply(item);
        });

        return this;
    }

    applyQueryResults (data : Array<Object>, options: Object = {}): Object {
        const idKey = this.Model.getFieldId();

        if (!Array.isArray(data)) {
            data = [];
        }

        const ids = data.map((modelData) => {
            return modelData[idKey];
        });

        this.requestCache.set(options, ids);

        return this;
    }

    all (): Array<Object> {
        if (Object.keys(this._models).length) {

            // Mapped owns many
            if (this.map) {
                return this.map.map((id) => {
                    return this._models[id];
                });
            }

            // Unmapped
            return Object.keys(this._models).map((id) => {
                return this._models[id];
            });
        }

        this.requestMany({});
        return [];
    }

    toJSON (options : Object = {}): any {
        if (options.recursive) {
            return this.all().map((model) => {
                return model.toJSON(options);
            });
        }

        return [];
    }

    query (options: Object = {}): Array<any> {
        let ids = this.requestCache.get(options);

        if (ids) {
            const models = ids.map((id) => {
                return this._models[id];
            });

            const anyDestroyed = models.filter((model) => {
                return model.getState('isDestroyed');
            }).length;

            if (!anyDestroyed) {
                return models;
            }
        }

        this.requestMany(options);
        return [];
    }

    refresh () {
        this.requestCache.clear();
    }
}

module.exports = OwnsMany;
