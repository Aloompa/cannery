/* @flow */

'use strict';

const BaseType = require('./base');

const defaultOptions = {
    map: null,
    metaFeild: 'meta',
    defaultQuery: {},
    batchRequest: true
};

class MultiModel extends BaseType {

    constructor (parentModel: Object, Model: Function, options: Object = {}) {
        super(parentModel, options || {});

        this.options = Object.assign({}, defaultOptions, options);
        this.map = options.map;
        this.Model = Model;

        this.modelStore = this.getModelStore();
        this.requestCache = parentModel.getRoot().requestCache;
        this._idAliases = {};
        this.allowRecurse = false;
    }

    getModelStore (): ?Object {
        throw new Error('MultiModel is virtual. It must be extended, and getModelStore() must be overriden');
    }

    get (id: string, options: Object = {}, depth: number = 0) : any {
        const aliasId = (this._idAliases) ? this._idAliases[id] : null;
        let model;

        if (aliasId && depth < 4) {
            return this.get(aliasId, options, depth + 1);
        }

        model = this.modelStore.get(id);

        if (!model) {
            model = this.requestOne(id, options);
        }

        return model;
    }

    set (): void {
        throw new Error('MultiModels are not settable.');
    }

    create (options: Object) : Object {
        return this.modelStore.instantiateModel(null, options);
    }

    apply (response: Object, query: Object = {}) : Object {
        const ids = this.modelStore.apply(response);
        const meta = response[this.options.metaFeild];

        this.requestCache.set(this.Model, this._parent, query, ids);
        this.requestCache.setMeta(this.Model, this._parent, query, meta);

        this.emit('change');

        return this;
    }

    toJSON (options: Object = {}) {
        return;
    }

    all (): Array<Object> {
        if (!this.options.batchRequest && !this.map.all().length) {
            return [];
        }

        if (!this.requestCache.get(this.Model, this._parent, this.options.defaultQuery)) {
            this.requestMany(this.options.defaultQuery);
        }

        if (this.map) {
            return this.modelStore
                .all()
                .filter((model) => {
                    return this.map.all().indexOf(model.id) >= 0;
                }).sort((modelA, modelB) => {
                    return this.map.all().indexOf(modelA.id) - this.map.all().indexOf(modelB.id);
                });
        } else {
            return this.modelStore.all();
        }
    }

    query (query: Object) : Array<Object> {
        let ids = this.requestCache.get(this.Model, this._parent, query);

        if (ids) {
            const models = ids.map((id) => {
                return this.modelStore.get(id);
            });

            models.getState = () => {
                return 'loaded';
            };

            return models;
        } else {
            const temporaryArray = [];

            this.requestCache.set(this.Model, this._parent, query, []);

            this.requestMany({
                query
            });

            return temporaryArray;
        }
    }

    requestOne (id: string, options: ?Object = {}): Object {
        let model = this.modelStore.get(id);

        if (!model) {
            model = this.modelStore.stub(id);
        }

        this.emit('fetching');

        const requestResponse = (response, error) => {

            if (error) {
                this.modelStore.stub(id);
                this.emit('fetchError');
                this.emit('change');
                return;
            }

            this.modelStore.apply(response);

            const responseId = response[this.Model.getFieldId()];

            if (responseId && id && (String(id) !== String(responseId))) {
                this._idAliases[id] = (responseId) ? String(responseId) : undefined;
            }

            this.emit('fetchSuccess');
            this.emit('change');
        };

        model.getAdapter().fetch(model, options, requestResponse.bind(this));

        return model;
    }

    requestMany (options: Object = {}): void {
        const query = options.query || {};

        this.emit('fetching');

        if (!this.options.batchRequest) {
            this.map.all().forEach((id) => {
                this.requestOne(id, options);
            });

            return;
        }

        this._parent.getAdapter().findAll(this.Model, this._parent, options, (response, err) => {

            if (response) {
                this.apply(response, query);
                this.emit('fetchSuccess');
                this.emit('change');
                return;
            }

            this.emit('fetchError');
            this.emit('change');
            this.apply({}, query);

        });
    }

    getMeta (query: Object): Object {
        this.query(query);
        return this.requestCache.getMeta(this.Model, this._parent, query);
    }

    move (model: Object, newIndex: number): Object {
        if (!this.map) {
            throw new Error('An unmapped MultiModel cannot be reordered');
        }

        const mapIds = this.map.all();
        const moveIndex = mapIds.indexOf(model.id);

        if (moveIndex >= 0) {
            this.map.move(moveIndex, newIndex);
        }

        return this;
    }

    length (): number {
        return (this.map) ? this.map.all().length : 0;
    }

    refresh (deep: boolean): Object {
        if (deep) {
            this.modelStore.clear();
        }

        this._idAliases = {};
        this.requestCache.clear(this.Model);

        return this;
    }
}

module.exports = MultiModel;
