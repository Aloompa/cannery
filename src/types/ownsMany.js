/* @flow */

'use strict';

const MultiModel = require('./multiModel');

class OwnsMany extends MultiModel {

    constructor (parentModel: Object, Model: Function, options: Object = {}) {
        super(...arguments);
        this.defaultQuery = options.defaultQuery || {};
        this.requestCache = this._parent.getRoot().requestCache;
        this._models = {};
        this._hasFetchedAll = false;
        this._meta = {};
    }

    _instantiateModel (id: ?string): Object {
        const { Model } = this;
        let newModel =  new Model(this._parent, id, this.options.modelOptions);

        newModel.on('destroy', this.handleDestroy);

        return newModel;
    }

    getModel (id: string): Object {
        return this._models[id];
    }

    apply (response: Object, query: Object = {}): void {
        const models = Array.isArray(response) ? response : [response];
        const idKey = this.Model.getFieldId();
        const ids = [];

        models.forEach((modelData) => {
            const id = String(modelData[idKey]);
            ids.push(id);

            const storedModel = this.getModel(id);

            if (storedModel) {
                storedModel.apply(modelData);
            } else {
                const newModel = this._instantiateModel(id).apply(modelData);
                this._models[id] = newModel;
            }

        });

        this.requestCache.set(query, ids);

        ids.forEach((id) => {
            const storedModel = this.getModel();
            if (storedModel) {
                store
            }
        });
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
        let model = this.getModel(id);

        if (!model) {
            model = this._instantiateModel(id);
        }

        this.emit('fetching');

        model.getAdapter().fetch(model, options, (response, error) => {

            if (error) {
                this._models[id] = this.create();

                return;
            }

            this.apply(response, options.query);

            const responseId = response[this.Model.getFieldId()];

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

        model
            .getAdapter()
            .findAll(this.Model, this._parent, options, (response, err) => {
                if (response) {
                    const key = this.Model.getFieldId();

                    this.apply(response, options);

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

    allModels () : Array<Object> {
        return Object.keys(this._models).map((id) => {
            return this._models[id];
        });
    }

    handleDestroy (model: Object) : void {
        if (this.map) {
            let modelIndex = this.map.all().indexOf(model.id);
            if (modelIndex >= 0) {
                this.map.remove(modelIndex);
            }
        }

        if (this._models[model.id]) {
            delete this._models[model.id];
        }
    }

    all (): Array<Object> {
        if (!this.requestCache.get(this.defaultQuery)) {
            this.requestMany(this.defaultQuery);
        }

        if (this.map) {
            // Mapped owns many
            return this
                .allModels()
                .filter((model) => {
                    return this.map.indexOf(model.id) >= 0;
                }).sort((modelA, modelB) => {
                    return this.map.indexOf(modelA.id) - this.map.indexOf(modelB.id);
                });
        } else {
            // Unmapped
            return this.allModels();
        }
    }

    toJSON (options : Object = {}): any {
        if (options.recursive) {
            return this.allModels().map((model) => {
                return model.toJSON(options);
            });
        }

        return [];
    }

    query (query: Object = {}): Array<any> {
        let ids = this.requestCache.get(query);

        if (ids) {
            const models = ids.all().map((id) => {
                return this._models[id];
            });

            models.getState = () => {
                return 'loaded';
            };

            return models;
        }

        const temporaryArray = [];

        temporaryArray.getState = () => {
            return 'loading';
        };

        this.requestCache.set({
            query
        }, []);

        this.requestMany({
            query
        });

        return [];
    }

    refresh () {
        this.requestCache.clear();
        return this;
    }
}

module.exports = OwnsMany;
