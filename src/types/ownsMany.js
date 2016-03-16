/* @flow */

'use strict';

const MultiModel = require('./multiModel');
const RequestCache = require('../util/requestCache');

class OwnsMany extends MultiModel {

    constructor () {
        super(...arguments);

        this.requestCache = new RequestCache();
        this._models = {};
        this._isRequesting = {};
        this._hasFetchedAll = false;
        this._meta = {};
    }

    _instantiateModel (id: ?string): Object {
        const { Model } = this;
        return new Model(this._parent, id, this.options.modelOptions);
    }

    _getModelById (id: string): Object {
        return this._models[id];
    }

    getMeta (query) {
        this.query(query);
        return this._meta[this.requestCache.getKey()];
    }

    create (): Object {
        return this._instantiateModel();
    }

    // Override
    requestOne (id: string, options: ?Object): any {
        let model = this._getModelById(id);

        if (!model) {
            model = this._instantiateModel(id);
        }

        this.emit('fetching');

        model.getAdapter().fetch(model, options, (response, error) => {

            if (error) {
                this._models[id] = this.create();

                return;
            }

            const responseId = response[this.Model.getFieldId()];

            if (!this._models[responseId]) {
                this._models[responseId] = this.create();
            }

            this._models[responseId].apply(response);

            if (id && (String(id) !== String(responseId))) {
                this._models[responseId].id = responseId;
                this._models[id] = this._models[responseId];
            }

            this.emit('fetchSuccess');
            this.emit('change');
        });

        return model;
    }

    // Override
    requestMany (options: Object = {}): any {
        const model = this._instantiateModel();
        const requestKey = JSON.stringify(options);

        if (this._isRequesting[requestKey]) {
            return this;
        }

        this._isRequesting[requestKey] = true;

        this.emit('fetching');

        model
            .getAdapter()
            .findAll(this.Model, this._parent, options, (response, err) => {
                if (response) {
                    delete this._isRequesting[requestKey];

                    const key = this.Model.getFieldId();

                    this.applyQueryResults(response, options);

                    this._meta[this.requestCache.getKey()] = response.meta;

                    response.forEach((item) => {
                        const id = item[key];
                        if (!this._models[id]) {
                            this._models[id] = this.create();
                            this._models[id].id = id;
                        }

                        this._models[id].apply(item);
                    });

                    this.emit('fetchSuccess');

                    return this.emit('change');
                }
            });

        return this;
    }

    apply (data : Array<Object>): Object {

        const idKey = this.Model.getFieldId();

        this._hasFetchedAll = true;

        data.forEach((item) => {
            const key = item[idKey];
            this._models[key] = this._models[key] || this._instantiateModel();
            this._models[key].apply(item);
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

        if (this._hasFetchedAll) {

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

        this._hasFetchedAll = true;

        this.requestMany();

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

    get (id: string, options: Object = {}): any {

        let model = this._models[id];

        if  (model) {
            if (model.getState('isDestroyed')) {
                return null;
            }

            return model;
        }

        this._models[id] = this._instantiateModel(id);

        // Silently set the id
        if (!this._models[id].id) {
            this._models[id]._fields._fields[this.Model.getFieldId()]._value = id;
            this._models[id].id = id;
        }

        if (!this.options.disableSingleFetch) {
            this.requestOne(id, options);
        }

        return this._models[id];
    }

    query (query: Object = {}): Array<any> {

        let ids = this.requestCache.get({
            query
        });

        if (ids) {
            const models = ids.map((id) => {
                return this._models[id];
            }).filter((model) => {
                return model && model.get(model.constructor.getFieldId());
            });

            const anyDestroyed = models.filter((model) => {
                return model.getState('isDestroyed');
            }).length;

            if (!anyDestroyed) {
                models.getState = () => {
                    return 'loaded';
                };

                return models;
            }
        }

        const temporaryArray = [];

        temporaryArray.getState = () => {
            return 'loading';
        };

        this.requestCache.set({
            query
        }, temporaryArray);

        this.requestMany({
            query
        });

        return temporaryArray;
    }

    refresh () {
        this.requestCache.clear();
        return this;
    }
}

module.exports = OwnsMany;
