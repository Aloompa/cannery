const EventEmitter = require('cannery-event-emitter');
const addListenersUtil = require('./util/addListeners');
const Adapter = require('cannery-adapter');
const ObjectType = require('./types/object');
const fields = Symbol();
const isFetched = Symbol();
const isChanged = Symbol();

class Model extends EventEmitter {

    constructor (id) {
        super();

        this.id = id;
        this[fields] = new ObjectType(this.getFields(), {
            parent: this
        });
        this[isFetched] = false;

        addListenersUtil(this, this[fields]);

        this.on('userChange', () => {
            this[isChanged] = true;
        });
    }

    static all (options) {
        return new this().getAdapter().findAll(this, options).then((arr) => {
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
        });
    }

    apply (data) {
        this[isFetched] = true;
        this[fields].apply(data);
        this.emit('change');
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

    refresh (options) {
        this.emit('fetching');

        return this.getAdapter().fetch(this, options).then((data) => {
            this.apply(data);
            this.emit('fetchSuccess');
            return this;

        }).catch((e) => {
            this.emit('fetchError', e);
            return new Error(e);
        });
    }

    set (key, value) {
        this[fields].set(key, value);
        return this;
    }

    save (options) {
        const requestType = (this.id) ? 'update' : 'create';

        try {
            this.validate();
        } catch (e) {
            return Promise.reject(e);
        }

        return this.getAdapter()[requestType](this, options).then((data) => {
            if (!this.id) {
                this.id = data.id;
            }

            this[isChanged] = false;

            return this.apply(data);
        });

    }

    toJSON () {
        return this[fields].toJSON();
    }

    validate () {
        this[fields].validate();
        return this;
    }

}

module.exports = Model;
