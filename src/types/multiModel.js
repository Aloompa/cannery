/* @flow */

'use strict';

const BaseType = require('./base');
const RequestCache = require('../util/requestCache');


class MultiModel extends BaseType {

    constructor (parentModel: Object, Model: Function, options: ?Object) {
        super(parentModel, options || {});

        this._watchedModels = [];
        this.options = options || {};
        this.map = this.options.map;
        this.Model = Model;
        this.requestCache = new RequestCache();
        this._listeners = {};
        this._models = {};
    }

    _instantiateModel (id: ?string): Object {
        const { Model } = this;
        const model = new Model(this._parent, this._parent, id, this.options.modelOptions);

        // Add new models to any existing listeners
        Object.keys(this._listeners).forEach((listenerType) => {
            const listener = this._listeners[listenerType];

            listener.push({
                model,
                event: model.on(listenerType, listener.callback)
            });
        });

        return model;
    }

    on (action: string, callback: Function) {
        this._listeners[action] = [];
        this._listeners[action].callback = callback;

        // Listen to existing models
        Object.keys(this._models).forEach((id) => {
            this._listeners[action].push({
                model: this._models[id],
                event: this._models[id].on(action, callback)
            });
        });
    }

    off (action: string) {
        const listenerKeys = Object.keys(this._listeners[action]);

        listenerKeys.forEach((listenerType) => {
            const listener = this._listeners[listenerType];

            if (!listener) {
                return;
            }

            listener.forEach(({ model, event }) => {
                model.off(event);
            });
        });
    }

    create (): Object {
        const model = this._instantiateModel();
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
            this._parent.get(this.map).add(model.id, index);
        }
    }

    remove (model: Object) {
        if (this.map) {
            let mapIds = this._parent.get(this.map).all();
            let removeIndex = mapIds.indexOf(model.id);

            if (removeIndex >= 0) {
                this._parent.get(this.map).remove(removeIndex);
            }
        }
    }

    refresh () {
        this.requestCache.clear();
    }
}

module.exports = MultiModel;
