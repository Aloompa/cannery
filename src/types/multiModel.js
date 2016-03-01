/* @flow */

'use strict';

const BaseType = require('./base');
const RequestCache = require('../util/requestCache');


class MultiModel extends BaseType {
    constructor (owner: Object, Model: Function, options: ?Object) {
        super(owner, options || {});

        this._watchedModels = [];
        this.options = options || {};
        this.map = this.options.map;
        this.Model = Model;
        this.requestCache = new RequestCache();

        //this.owner.on('saveSuccess', this.refresh.bind(this));
    }

    create (): Object {
        const ModelConstructor = this.Model;
        const model = new ModelConstructor(this.owner);
        this._watchedModels.push(model);
        return model;
    }

    store (response: Array<Object>): void {
        throw new Error('MultiModel is virtual. It must be extended, and store() must be overriden');
    }

    fetch (id: string): Object {
        throw new Error('MultiModel is virtual. It must be extended, and fetch() must be overriden');
    }

    requestOne (id: string, options: ?Object): void {
        throw new Error('MultiModel is virtual. It must be extended, and requestOne() must be overriden');
    }

    requestMany (options: ?Object): void {
        throw new Error('MultiModel is virtual. It must be extended, and requestMany() must be overriden');
    }

    apply (response: any, options: ?Object): any {
        let models = Array.isArray(response) ? response : [response];

        const idKey = this.Model.idField;

        const ids = models.map((modelData) => {
            return modelData[idKey];
        });

        this.requestCache.set(options, ids);
        this.store(models);
    }

    get (id: string, options: ?Object): any {
        let model = this.fetch(id);

        if  (model) {
            return model;

        } else {
            this.requestOne(id, options || {});
        }
    }

    all (options: ?Object): Array<any> {
        let ids = this.requestCache.get(options || {});

        if (ids) {
            return ids.map((id) => {
                return this.fetch(id);
            });
        } else {
            this.requestMany(options || {});
            return [];
        }
    }

    add (model: Object, index: number) {
        if (this.map) {
            this.owner.get(this.map).add(model.id, index);
        }
    }

    remove (model: Object) {
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
