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
    }

    _instantiateModel (id: ?string): Object {
        const { Model } = this;
        const model = new Model(this._parent, id, this.options.modelOptions);

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

    _getRandomKey (): number {
        return new Date().getTime();
    }

    create (): Object {
        const model = this._instantiateModel();

        this._models[this._getRandomKey()] = model;

        return model;
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

    store (response: Array<Object>): void {
        throw new Error('MultiModel is virtual. It must be extended, and store() must be overriden');
    }

    fetch (id: string): Object {
        throw new Error('MultiModel is virtual. It must be extended, and fetch() must be overriden');
    }

    requestOne (id: string, options: ?Object): void {
        throw new Error('MultiModel is virtual. It must be extended, and requestOne() must be overriden');
    }

    requestMany (options: Object): void {
        throw new Error('MultiModel is virtual. It must be extended, and requestMany() must be overriden');
    }

    apply (response: any, options: Object = {}): any {
        let models = Array.isArray(response) ? response : [response];

        const idKey = this.Model.getFieldId();

        const ids = models.map((modelData) => {
            return modelData[idKey];
        });

        this.requestCache.set(options, ids);
        this.store(models);
    }

    get (id: string, options: Object = {}): any {
        let model = this._getModelById(id);

        if  (model) {
            return model;

        } else {
            this.requestOne(id, options);
        }
    }

    add (model: Object, index: ?number): Object {

        if (!this.map) {
            throw new Error('An unmapped OwnsMany cannot be added to');
        }

        this.map.add(model.id, index);

        return this;
    }

    refresh () {
        this.requestCache.clear();
    }

    remove (model: Object) {

        if (!this.map) {
            throw new Error(`An unmapped ${this.constructor.name} cannot be removed`);
        }

        const mapIds = this.map.all();
        const removeIndex = mapIds.indexOf(model.id);

        if (removeIndex >= 0) {
            this.map.remove(removeIndex);
        }
    }

    move (model: Object, newIndex: number): Object {

        if (!this.map) {
            throw new Error('An unmapped OwnsMany cannot be moved');
        }

        const mapIds = this.map.all();
        const moveIndex = mapIds.indexOf(model.id);

        if (moveIndex >= 0) {
            this.map.move(moveIndex, newIndex);
        }

        return this;
    }

}

module.exports = MultiModel;
