'use strict';

const ArrayType = require('./array');
const eventTypes = require('../util/eventTypes');
const RequestCache = require('../util/RequestCache');

const mapping = Symbol();
const addById = Symbol();
const fetchSuccess = Symbol();
const fetchError = Symbol();
const modelIds = Symbol();

class HasMany extends ArrayType {

    constructor (ModelType, options = {}) {
        super(ModelType);

        this.options = options;
        this[modelIds] = {};
        this.requestCache = new RequestCache();
        this.idMap = /* new ModelType.getFields().id.map ||*/ 'id';

        if (options.map) {
            this[mapping] = options.map;

            this[mapping].toJSON = () => {
                return this.map((model) => {
                    return model.get('id');
                });
            };
        }
    }

    [ fetchSuccess ] (data) {
        this.emit('fetchSuccess');

        return data;
    }

    [ fetchError ] (err) {
        this.emit('fetchError', err);

        return err;
    }

    all (options) {
        let cachedIds = this.requestCache.get(options);
        debugger;
        
        if (!cachedIds) {
            const Model = this.getType();

            new Model()
                .getAdapter()
                .findAllWithin(Model, this.parent, Object.assign({}, this.options, options))
                .then(this.handleResponse.bind(this, options))
                .then(this[fetchSuccess].bind(this))
                .catch(this[fetchError].bind(this));
        }

        return this.getModels(options);
    }

    getModels (options) {
        let cachedIds = this.requestCache.get(options);

        if (cachedIds) {
            return cachedIds.map((id) => {
                return this.getById(id);
            });
        }

        return [];
    }

    handleResponse (options, data) {
        const ModelClass = this.getType();

        let existingIds = super.all().map((model) => {
            return model.id;
        });

        let responseIds = data.map((modelData) => {
            return modelData[ModelClass.idField];
        });

        let newModels = data.filter((modelData) => {
            return existingIds.indexOf(modelData[ModelClass.idField]) === -1;
        });

        let existingModels = data.filter((modelData) => {
            return existingIds.indexOf(modelData[ModelClass.idField]) !== -1;
        });

        this.apply(existingModels);
        this.add(newModels);
        this.requestCache.set(options, responseIds);
    }

    call (method, options) {
        return this.getType()[method](this.options, options);
    }

    getById (id) {
        if (this[modelIds][id]) {
            return this[modelIds][id];
        }

        const filteredModels = super.all().filter((model) => {
            return model.id === id;
        });

        if (filteredModels.length === 1) {
            return filteredModels[0];
        }

        const Model = this.getType();
        const model = new Model(id);

        model.getPath = () => {
            return `${this.parent.getName()}/${this.parent.id}/${model.getName()}/${id}`;
        };

        model.getParent = () => {
            return this.parent;
        };

        this[modelIds][id] = model;

        return model;
    }

    instantiateItem (data) {

        const Model = this.getType();
        const model = new Model(data.id, this.getOptions());

        eventTypes.forEach((eventType) => {
            model.on(eventType, () => {
                this.emit(eventType);
            });
        });

        model.getParent = () => {
            return this.parent;
        };

        this[modelIds][data.id] = model;

        return model;
    }

    refresh (options) {
        this.requestCache.clear(options);

        return this.all(options);
    }

    toJSON () {
        return null;
    }

}

module.exports = HasMany;
