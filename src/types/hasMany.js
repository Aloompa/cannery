'use strict';
const EventEmitter = require('cannery-event-emitter');
const RequestCache = require('../util/requestCache');
const addListenersUtil = require('../util/addListeners');

const models = Symbol();
const mapping = Symbol();
const Type = Symbol();
const requestCache = Symbol();
const getMultiple = Symbol();
const setMap = Symbol();
const addToMap = Symbol();
const addModelListeners = Symbol();

class HasMany extends EventEmitter{
    constructor (ModelClass, options) {
        super();
        options = options || {};

        this[mapping] = options.map;
        this[Type] = ModelClass;
        this[models] = {};
        this[requestCache] = new RequestCache();
    }

    apply (responseData) {
        responseData.forEach((modelData) => {
            let modelId = modelData[this[Type].fieldId];

            let existingModel = this[models][modelId];

            if (!existingModel) {
                let newModel = new this[Type](modelId);

                newModel.getParent = () => {
                    return this.parent;
                };

                newModel.apply(modelData);

                this[models][modelId] = newModel;
                this[addModelListeners](newModel);

            } else {
                existingModel.apply(modelData);
            }
        });

        return this;
    }

    all (options) {
        let cacheIds = this[requestCache].get(options);

        if (cacheIds) {
            return this[getMultiple](cacheIds);

        } else {
            this.emit('fetching');
            this[requestCache].set(options, []);

            this.makeRequest(options)
                .then((response) => {
                    return this.handleResponse(options, response);
                })
                .catch(this.emit.bind(this, 'fetchError'));

            return [];
        }
    }

    makeRequest (options) {
        return new this[Type]()
            .getAdapter()
            .findAllWithin(this[Type], this.parent, options);
    }

    get (id) {
        if (!this[models][id]) {
            this[models][id] = new this[Type](id);
            this[addModelListeners](this[models][id]);
        }

        return this[models][id];
    }

    removeAll () {
        this[setMap]([]);

        return this;
    }

    remove (id) {
        let newIds = this.all().filter((modelId) => {
            return modelId !== id;
        });

        this[setMap](newIds);

        return this;
    }

    move (id, delta) {
        let oldIds = this.map.all();
        let oldIndex = oldIds.indexOf(id);
        let newIndex = oldIndex + delta;

        if (newIndex < 0) {
            newIndex = 0;
        } else if (newIndex >= oldIds.length) {
            newIndex = oldIds.length - 1;
        }

        this.map.move(oldIndex, newIndex);

        this.emit('change');
        this.emit('userChange');

        return this;
    }

    add (model, index) {
        model.getParent = () => {
            return this.parent;
        };

        this[models][model.id] = model;

        if (model.id) {
            this[addToMap](model, index);
        } else {
            model.on('saveSuccess', this[addToMap].bind(this, model, index));
        }

        this.emit('change');
        this.emit('userChange');

        return this;
    }

    call (method, options) {
        return this.getType()[method](this.options, options);
    }

    toJSON () {
        return null;
    }

    set () {
        throw new Error('Set cannot be called directly on HasMany.');
    }

    forEach (fn, options) {
        return this.all(options).forEach(fn);
    }

    map (fn, options) {
        return this.all(options).map(fn);
    }

    getMapped () {
        return this[mapping];
    }

    getType () {
        return this[Type];
    }

    refresh (options) {
        this[requestCache].clear(options);
        return this.all(options);
    }

    saveChildren (options, single) {
        let promises = [];
        Object.keys(this[models]).forEach((id) => {
            promises.push(this[models][id].save(options, single));
        });

        return promises;
    }

    handleResponse (options, responseData) {
        const responseIds = responseData.map((modelData) => {
            const id = modelData[this.getType().fieldId];

            if (!id) {
                throw new Error(`No response Id available for ${this.getType().getName()}`);
            }

            return id;
        });

        this.apply(responseData);

        this[requestCache].set(options, responseIds);

        this.emit('fetchSuccess');

        return responseData;
    }

    [ addModelListeners ] (model) {
        addListenersUtil(this, model);

        model.getParent = () => {
            return this.parent;
        };
    }

    [ getMultiple ] (ids) {
        return ids.map(this.get.bind(this));
    }

    [ setMap ] (arr) {
        if (!this[mapping]) {
            throw new Error('This operation is not supported because the HasMany is not mapped.');
        }

        this[mapping].set(arr);

        this.emit('change');
        this.emit('userChange');
    }

    [ addToMap ] (model, index) {
        if (this[mapping] && model.id) {
            this[mapping].add(model.id, index);
        }
    }
}

module.exports = HasMany;
