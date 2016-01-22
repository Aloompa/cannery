'use strict';

const ArrayType = require('./array');
const eventTypes = require('../util/eventTypes');
const isFetched = Symbol();
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
        if (!this[isFetched]) {
            const Model = this.getType();

            this[isFetched] = true;

            new Model()
                .getAdapter()
                .findAllWithin(Model, this.parent, Object.assign({}, this.options, options))
                .then(this.apply.bind(this))
                .then(this[fetchSuccess].bind(this))
                .catch(this[fetchError].bind(this));
        }

        return super.all();
    }

    call (method, options) {
        return this.getType()[method](this.options, options);
    }

    getById (id) {
        if (this[modelIds][id]) {
            return this[modelIds][id];
        }

        const filteredModels = this.all().filter((model) => {
            return model.get('id') === id;
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
        this[isFetched] = false;

        return this.all(options);
    }

    toJSON () {
        return null;
    }

}

module.exports = HasMany;
