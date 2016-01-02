const defer = require('lodash.defer');
const has = require('lodash.has');
const clone = require('lodash.clone');
const EventEmitter = require('cannery-event-emitter');
const Adapter = require('cannery-adapter');
const Field = require('./field');
const debug = require('debug')('cannery-model');

class Model extends EventEmitter {

    constructor (id, options) {

        super({
            throttle: 50
        });

        let data = {};

        this.id = id;

        // Don't force a re-fetch if the data is passed in
        if (id !== null && typeof id === 'object') {
            this._fetched = (options) ? options.fetched : false;
            data = id;
            this.id = data.id;
        }

        this.name = this.constructor.getName();

        this.fields = this.applyFields(data);
        this.hooks = this.getHooks();
    }

    static getName () {
        return '';
    }

    static getNamePlural () {
        let name = this.getName().toLowerCase();
        return `${name}s`;
    }

    static getUrl () {
        return this.getNamePlural();
    }

    static getNestedKey () {
        return this.getName().toLowerCase();
    }

    static all (options = {}) {
        const model = new this();
        let url = options.url || this.getUrl();
        let nestedKey = options.nestedKey || this.getNamePlural();

        delete options.nestedKey;

        function requestResult (data = {}) {
            let models = [];

            if (!data[nestedKey]) {
                return models;
            }

            data[nestedKey].forEach((modelData) => {
                models.push(new this(modelData, {
                    fetched: true
                }));
            });

            if (data._meta && data._meta.pagination) {
                models.pagination = data._meta.pagination;
            }

            models.on = (evt, fn) => {
                let subscriptions = [];

                models.forEach((model) => {
                    subscriptions.push(model.on(evt, fn));
                });

                return subscriptions;
            };

            return models;
        }

        // TODO: There is some leak where a second call is made with the options being the model itself
        // We need to hunt this down and see where the issue is originating
        if (options && options.options) {
            return new Promise((resolve, reject) => {
            });
        }

        return model.getAdapter().findAll(options).then(requestResult.bind(this));
    }

    static create (data = {}, options = {}) {

        let serverObject = {};
        let modelName = this.getNestedKey();
        const model = new this();

        options = Object.assign(options, new this());

        serverObject[modelName] = data;
        options.url = options.url || this.getUrl();

        return model.getAdapter().create(serverObject, modelName);
    }

    static destroy (instance) {
        const model = new this();
        const id = instance.id || instance;
        model.url = this.getUrl();
        return model.getAdapter().destroy(id);
    }

    getHooks () {
        return {

            get: () => {

            },

            set: () => {

            },

            pull: () => {

            },

            pullFilter: () => {

            },

            push: () => {

            },

            pushFilter: () => {

            },

            fetching: () => {

            },

            fetchSuccess: () => {

            },

            fetchError: () => {

            }

        };
    }

    getAdapter () {
        return new Adapter(this);
    }

    create (options) {
        this.emit('save');

        try {
            this.validate();
            return this.constructor.create(
                this.toJSON(), options
            ).then((response) => {
                this.id = response.id;
                this.fields.initialize(response);
                return response;
            });
        } catch (e) {
            return Promise.reject(e);
        }
    }

    getFields () {
        return {};
    }

    applyFields (data) {
        const field = new Field({
            fields: this.getFields(),
            data: data,
            rootUrl: this.constructor.getUrl()
        });

        field.on('change', () => {
            this.emit('change');
        });

        field.on('userChange', () => {
            this.emit('userChange');
        });

        return field;
    }

    applyHook (field, hook, value, fields) {
        let hooks;

        fields = fields || this.fields;

        hooks = fields[field].hooks;

        if (hooks && hooks[hook]) {
            return hooks[hook](value, field);
        } else {
            return value;
        }
    }

    set (field, value) {
        this.fields.set(field, value);
        return this;
    }

    save () {
        this.emit('save');

        Object.keys(this.getFields()).forEach((field) => {
            this.fields.applyHook('pushFilter', field);
            this.fields.applyHook('push', field);
        });

        const modelName = this.constructor.getNestedKey() || this.name.toLowerCase();

        return this.fields.trickleSave().then(() => {
            return this.validate();
        }).then(() => {
            const data = {
                [modelName]: this.fields.toJSON()
            };

            return this.getAdapter().update(this.id || this.get('id'), data, modelName);
        });
    }

    getAsync (field, options, forceReload) {
        let value = this.fields.get(field, options);

        if (options && options.options) {
            return;
        }

        if (value) {
            Promise.resolve(value);
        }

        this._fetched = true;

        if (has(this.fields[field], 'hooks.pull')) {
            this.emit('fetching');

            return this.fields.applyHook('pull', field).then((data) => {
                const hookedData = this.fields.applyHook('pullFilter', field, data);
                this.fields.set(field, hookedData);
            })
            .then(() => {
                this.emit('fetchSuccess');
                return this.get(field, options, forceReload);
            })
            .catch((e) => {
                debug(e);
                this.emit('fetchError', e);
            });

        } else {
            options = this;
            options.url = this.constructor.getUrl();
            this.emit('fetching');

            return this.getAdapter()
                .findOne(this.id)
                .then((data) => {
                    this.fields.initialize(data);
                    this.emit('change');
                })
                .then(() => {
                    this.emit('fetchSuccess');
                    return this.get(field, options, forceReload);
                })
                .catch((e) => {
                    debug(e);
                    this.emit('fetchError', e);
                });
        }
    }

    get (field, options, forceReload) {
        let value = this.fields.get(field, options);

        if (!this.id) {
            return value;
        }

        // Only fetch data if there is no value or if we've asked to force-reload it
        if (!this._fetched || forceReload) {
            this.getAsync(field, options, forceReload);
        }

        return value;
    }

    add (field, item, index) {
        return this.fields.add(field, item, index);
    }

    remove (field, item) {
        return this.fields.remove(field, item);
    }

    removeAll (field) {
        return this.fields.removeAll(field);
    }

    move (field, oldIndex, newIndex) {
        return this.fields.move(field, oldIndex, newIndex);
    }

    validate (name) {
        return this.fields.validate(name);
    }

    toJSON () {
        return this.fields.toJSON();
    }

    refresh () {
        this.getAdapter().clearCache(this.id);

        this.fields._data = {};
        this._fetched = false;

        this.emit('change');
    }
}

module.exports = Model;
