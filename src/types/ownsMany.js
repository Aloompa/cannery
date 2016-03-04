/* @flow */

'use strict';

const MultiModel = require('./multiModel');

class OwnsMany extends MultiModel {

    constructor () {
        super(...arguments);
        this._models = {};
    }

    _getModelById (id: string): Object {
        return this._models[id];
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

    store (response: Array<Object>) {
        const idKey = this.Model.getFieldId();

        response.forEach((modelData) => {
            const id = modelData[idKey];

            if (!id) {
                return;
            }

            let storedModel = this._getModelById(id);

            if (storedModel) {
                storedModel.apply(modelData);
            } else {
                let newModel = this._instantiateModel(id);
                newModel.apply(response);
                this._models[id] = newModel;
            }
        });
    }

    // @override
    requestOne (id: string, options: ?Object): any {
        let model = this._getModelById(id);

        if (!model) {
            model = this._instantiateModel(id);
        }

        model.getAdapter().fetch(model, options, (response) => {
            model.apply(response);
        });

        return model;
    }

    // @override
    requestMany (options: Object = {}): any {
        const model = this._instantiateModel();

        model
            .getAdapter()
            .findAll(this.Model, this._parent, options, (response) => {
                return this
                    .apply(response)
                    .applyQueryResults(response, options);
            });

        return this;
    }

    apply (data : Array<Object>): Object {
        data.forEach((item) => {
            const model = this._instantiateModel();

            this._models[item.id] = model;
            model.apply(item);
        });

        return this;
    }

    applyQueryResults (data : Array<Object>, options: Object = {}): Object {
        const idKey = this.Model.getFieldId();

        const ids = data.map((modelData) => {
            return modelData[idKey];
        });

        this.requestCache.set(options, ids);

        return this;
    }

    all (): Array<Object> {
        return this.map.map((id) => {
            return this._models[id];
        });
    }

    add (model: Object, index: ?number): Object {
        super.add(...arguments);

        this._models[model.id] = model;

        return this;
    }

    toJSON (options : Object = {}): any {
        if (options.recursive) {
            return this.all().map((model) => {
                return model.toJSON(options);
            });
        }

        return [];
    }

    query (options: Object = {}): Array<any> {
        let ids = this.requestCache.get(options);

        if (ids) {
            const models = ids.map((id) => {
                return this._models[id];
            });

            const anyDestroyed = models.filter((model) => {
                return model.getState('isDestroyed');
            }).length;

            if (!anyDestroyed) {
                return models;
            }
        }

        this.requestMany(options);
        return [];
    }
}

module.exports = OwnsMany;
