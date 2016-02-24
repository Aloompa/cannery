'use strict';

const BaseType = require('./base');
const RequestCache = require('../util/requestCache');


class MultiModel extends BaseType {
    constructor (owner, Model, options) {
        super(owner, options);

        this.options = options || {};
        this.map = this.options.map;
        this.Model = Model;
        this.requestCache = new RequestCache();

        this.owner.on('saveSuccess', this.refresh.bind(this));
    }

    store (response) {
        throw new Error('MultiModel is virtual. It must be extended, and store() must be overriden');
    }

    fetch (id) {
        throw new Error('MultiModel is virtual. It must be extended, and fetch() must be overriden');
    }

    requestOne (id, options) {
        throw new Error('MultiModel is virtual. It must be extended, and requestOne() must be overriden');
    }

    requestMany (options) {
        throw new Error('MultiModel is virtual. It must be extended, and requestMany() must be overriden');
    }

    apply (response, options) {
        let models = Array.isArray(response) ? response : [response];

        const idKey = this.Model.idField;

        const ids = models.map((modelData) => {
            return modelData[idKey];
        });

        this.requestCache.set(options, ids);
        this.store(models);
    }

    get (id, options = {}) {
        let model = this.fetch(id);

        if  (model) {
            return model;
        } else {
            this.requestOne(id, options);
        }
    }

    all (options = {}) {
        let ids = this.requestCache.get(options);

        if (ids) {
            return ids.map((id) => {
                return this.fetch(id);fetch
            });
        } else {
            this.requestMany(options);
            return [];
        }
    }

    add (model, index) {
        if (this.map) {
            this.owner.get(this.map).add(model.id, index);
        }
    }

    remove (model) {
        if (this.map) {
            let mapIds = this.owner.get(this.map).all();
            let removeIndex = mapIds.indexOf(model.id);

            if (removeIndex >= 0) {
                this.owner.get(this.map).remove(removeIndex);
            }
        }
    }

    refresh () {
        this.requestCache.clear();
    }
}

module.exports = MultiModel;
