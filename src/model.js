'use strict';

const EventEmitter = require('cannery-event-emitter');
const addListenersUtil = require('./util/addListeners');
const Adapter = require('cannery-adapter');
const ObjectType = require('./types/object');
const fields = Symbol();
const isFetched = Symbol();
const isChanged = Symbol();
const isSaving = Symbol();
const doFetch = Symbol();
const saveThis = Symbol();
const saveChildren = Symbol();

class Model extends EventEmitter {

    constructor (id, options) {
        super();

        this.id = id;
        this[fields] = new ObjectType(this.getFields(...arguments), {
            parent: this
        });
        this[isFetched] = false;
        this.options = options;

        addListenersUtil(this, this[fields]);

        this.on('userChange', () => {
            this[isChanged] = true;
        });

        this.on('saving', () => {
            this[isSaving] = true;
            this.emit('change');
        });

        this.on('saveSuccess', () => {
            this[isChanged] = false;
            this[isSaving] = false;
        });

        this.on('saveError', () => {
            this[isSaving] = false;
        });
    }

    static all (options) {
        return new this().getAdapter().findAll(this, options).then(this.applyModels.bind(this));
    }

    static applyModels (arr) {
        let models = [];

        arr.forEach((obj) => {
            const model = new this(obj.id);
            model.apply(obj);
            models.push(model);
        });

        models.on = (evt, callback) => {
            let subscriptions = [];

            models.forEach((model) => {
                subscriptions.push(model.on(evt, callback));
            });

            return subscriptions;
        };

        return models;
    }

    [ doFetch ] (options) {
        const parent = this.getParent();
        const adapter = this.getAdapter();

        options = Object.assign({}, options, this.options);

        if (parent) {
            return adapter.fetchWithin(this, parent, options);

        } else {
            return adapter.fetch(this, options);
        }

    }

    apply (data) {
        const responseId = data[this.constructor.fieldId];

        if (responseId && this.id && this.id !== responseId) {
            throw new Error('Server responded with non-matching ID. Refusing to apply data');
        } else {
            this.id = responseId;
        }

        this[fields].apply(data);
        this[isFetched] = true;
        return this;
    }

    destroy (options) {
        return this.getAdapter().destroy(this, options);
    }

    get (key) {

        if (!this[isFetched] && this.id) {
            this[isFetched] = true;
            this.refresh();
        }

        return this[fields].get(key);
    }

    getAdapter () {
        return new Adapter();
    }

    getParent () {
        return null;
    }

    getFields () {
        throw new Error('The getFields() method is not defined');
    }

    isChanged () {
        return this[isChanged];
    }

    isSaving () {
        return this[isSaving];
    }

    refresh (options) {
        this.emit('fetching');

        const modelOptions = Object.assign({}, this, options);

        return this[doFetch](modelOptions).then((data) => {
            this.apply(data);

            this.emit('fetchSuccess');
            return this;

        }).catch((e) => {
            this.emit('fetchError', e);
            throw new Error(e.message);
        });
    }

    set (key, value) {
        this[fields].set(key, value);
        this[isChanged] = true;
        return this;
    }

    save (options, single) {
        if (!single) {
            return this[saveChildren](options)
                .then(this[saveThis].bind(this, options))
                .catch((e) => {
                    this.emit('saveError', e);
                    return Promise.reject(e);
                });
        } else {
            return this[saveThis](options)
                .catch((e) => {
                    this.emit('saveError', e);
                    return Promise.reject(e);
                });
        }
    }

    toJSON () {
        return this[fields].toJSON();
    }

    validate (key) {
        this[fields].validate(key);
        return this;
    }

    [ saveThis ] (options) {
        if (!this.isChanged()) {
            return Promise.resolve();
        }

        const requestType = (this.id) ? 'update' : 'create';

        this.emit('saving');

        try {
            this.validate();
        } catch (e) {
            this.emit('saveError', e);
            return Promise.reject(e);
        }

        return this.getAdapter()[requestType](this, options).then((data) => {

            if (!this.id) {
                this.id = data[this.constructor.idField];
            }

            this.emit('saveSuccess');

            return this.apply(data);

        });
    }

    [ saveChildren ] (options) {
        let fields = this.getFields();
        let promises = [];
        Object.keys(fields).forEach((key) => {
            if (fields[key].constructor.name === 'HasMany') {
                promises.concat(this.get(key).saveChildren(options));
            } else if (fields[key].constructor.name === 'HasOne') {
                promises.push(this.get(key).save(options));
            }
        });

        return Promise.all(promises);
    }
}

Model.fieldId = 'id';

module.exports = Model;
