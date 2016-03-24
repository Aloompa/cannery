/* @flow */

'use strict';

const BaseType = require('./base');

const defaultOptions = {
    map: null,
    metaFeild: 'meta',
    defaultQuery: {}
};

class MultiModel extends BaseType {

    constructor (parentModel: Object, Model: Function, options: Object = {}) {
        super(parentModel, options || {});

        this.options = Object.assign(defaultOptions, options);
        this.map = options.map;
        this.Model = Model;

        this.modelStore = this.getModelStore();
        this.modelStore.setEventHandler(this._handleEvent.bind(this));
        this.requestCache = parentModel.getRoot().requestCache;
        this._idAliases = {};
        this.allowRecurse = false;
    }

    getModelStore () {
        throw new Error('MultiModel is virtual. It must be extended, and getModelStore() must be overriden');
    }

    get (id: string, options: Object = {}, depth: Number = 0) : any {
        let model = this.modelStore.get(id);

        if (!model) {
            const aliasId = this._idAliases[id];

            if (aliasId && depth < 4) {
                return this.get(aliasId, options, depth + 1);
            }

            this.requestOne(id, options);
            model = null;
        }

        return model;
    }

    set () {
        throw new Error('MultiModels are not settable.');
    }

    create (options: Object) : Object {
        return this.modelStore.instantiateModel(null, options);
    }

    apply (response: Object, query: Object = {}) : void {
        const ids = this.modelStore.apply(response);
        const meta = response[this.options.metaFeild];

        this.requestCache.set(this.Model, this._parent, query, ids);
        this.requestCache.setMeta(this.Model, this._parent, query, meta);

        this.emit('change');
    }

    toJSON (options: ?Object = {}) {
        return;
    }

    all (): Array<Object> {
        debugger;
        if (!this.requestCache.get(this.Model, this._parent, this.defaultQuery)) {
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

            temporaryArray.getState = () => {
                return 'loading';
            };

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

        model.getAdapter().fetch(model, options, (response, error) => {

            if (error) {
                this.emit('fetchError');
                this.modelStore.stub(id);
                return;
            }

            this.modelStore.apply(response);

            const responseId = response[this.Model.getFieldId()];

            if (id && (String(id) !== String(responseId))) {
                this._idAliases[id] = String(responseId);
            }

            this.emit('fetchSuccess');
            this.emit('change');
        });

        return model;
    }

    requestMany (options: Object = {}): void {
        const query = options.query || {};

        this.emit('fetching');

        this._parent.getAdapter().findAll(this.Model, this._parent, options, (response, err) => {
            if (response) {
                const key = this.Model.getFieldId();

                this.apply(response, query);
                this.emit('fetchSuccess');
                this.emit('change');
            }
        });
    }

    getMeta (query) {
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

    length () {
        return this.map.all().length;
    }

    refresh (deep: Boolean) {
        if (deep) {
            this.modelStore.clear();
        }

        this._idAliases = {};
        this.requestCache.clear(this.Model);
        return this;
    }

    _handleEvent (event, ...args) {
        return;
        this.emit(event, ...args);
    }
}

module.exports = MultiModel;
