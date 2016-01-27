'use strict';
const EventEmitter = require('cannery-event-emitter');
const RequestCache = require('../util/requestCache');

const models = Symbol();
const map = Symbol();
const Type = Symbol();
const indexOfId = Symbol();
const requestCache = Symbol();
const getMultiple = Symbol();
const handleResponse = Symbol();
const setMap = Symbol();
const addToMap = Symbol();

class HasMany extends EventEmitter{
    constructor (ModelClass, options) {
        super();
        options = options || {};

        this[map] = options.map;
        this[Type] = ModelClass;
        this[models] = [];
        this[requestCache] = new RequestCache();
    }

    apply (responseData) {
        responseData.forEach((modelData) => {
            let modelId = modelData[this[Type].idField];
            let existingModel = this.get(modelId);

            if (!existingModel) {
                let newModel = new this[Type](modelId).apply(modelData);
                this[models].push(mewModel);
            } else {
                existingModel.apply(modelData);
            }
        });
    }

    all (options) {
        let cacheIds = this[requestCache].get(options);

        if (cacheIds) {
            return this[getMultiple](cacheIds);
        } else {
            this.emit('fetching');
            this.makeRequest(options)
                .then(this[handleResponse].bind(this, options))
                .then(this.emit.bind(this, 'fetchSuccess'))
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
        let index = this[indexOfId](id);
        return this[models][index];
    }

    removeAll () {
        this[setMap]([]);
    }

    remove (id) {
        let newIds = this.map.all().filter((modelId) => {
            return modelId !== id;
        });

        this[setMap](newIds);
    }

    move (id, delta) {
        let oldIds = this.map.all()
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
    }

    add (model, index) {
        this[models].push(model);

        if (model.id) {
            this[addToMap](model, index);
        } else {
            model.on('saveSuccess', this[addToMap].bind(this, model, index));
        }

        this.emit('change');
        this.emit('userChange');
    }

    toJSON () {
        return null;
    }

    set () {
        throw new Error('Set cannot be called directly on HasMany.')
    }

    forEach (fn, options) {
        this.all(options).forEach(fn);
    }

    map (fn, options) {
        this.all(options).map(fn);
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
        this[models].forEach((model) => {
            promises.push(model.save(options, single));
        });

        return promises;
    }

    [ indexOfId ] (id) {
        for (let i = 0; i < this[models].length; i++) {
            if (this[models].id === id) {
                return i;
            }
        }

        return null;
    }

    [ getMultiple ] (ids) {
        return ids.map((id) => {
            return this.get(id);
        });
    }

    [ handleResponse ] (options, responseData) {
        let responseIds = responseData.map((modelData) => {
            return modelData[this[Type].fieldId];
        });

        this[requestCache].set(options, responseIds);

        this.apply(responseData);
    }

    [ setMap ] (arr) {
        if (!this[map]) {
            throw new Error('This operation is not supported because the HasMany is not mapped.');
        }

        this[map].set(arr);

        this.emit('change');
        this.emit('userChange');
    }

    [ addToMap ] (model, index) {
        if (model.id) {
            this[map].add(model.id, index);
        }
    }
}

module.exports = HasMany;
