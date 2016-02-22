'use strict';

const defaultOptions = {
    excludeUnchanged: false
};

class Adapter {
    constructor (options = {}) {
        this.options = Object.assign({}, defaultOptions, options);
    }

    getAncestry (model) {
        let modelScope = model.getScope();

        if (!modelScope) {
            return [];
        }

        return this.getAncestry(modelScope).concat(model);
    }

    getPathObject (model) {
        if (Array.isArray(model)) {
            return model.map(this.getPathObject);
        } else if (model.constructor.getKey) {
            // model is instantiated
            return {
                key: model.constructor.getKey(),
                id: model.id,
                keySingular: model.constructor.getKey(true)
            };
        } else if (model.getKey) {
            // model is a constructor
            return {
                key: model.getKey(),
                singular: model.getKey(true)
            };
        } else {
            return {
                key: model.toString()
            };
        }
    }

    getPath (model) {
        return this.getPathObject(this.getAncestry(model));
    }

    getRoot (model) {
        return this.getAncestry(model)[0];
    }

    makeRequest (request, callback) {
        /*
            request is a JSON object of the form:
            {
                requestType: 'getOne' or 'getMany' or 'create' or 'update' or 'destroy',
                path: ['rootKey', 'grandparentKey', 'parentKey', 'resorceKey'],
                id: model.id or null,
                payload: an object of data to include in request or null,
                options: an object of options set by user
            }
         */

        throw new Error('makeRequest is virtual and must be overriden.');
    }

    fetch (model, options) {
        return this.makeRequest({
            requestType: 'getOne',
            path: this.getPath(model),
            id: model.id,
            payload: null,
            options: options
        }, (response, err) => {
            if (err) {
                this.getRoot(model).handleError(err);
                return;
            }
            model.apply(response, options);
        });
    }

    fetchWithin (Model, context, options) {
        return this.makeRequest({
            requestType: 'getOne',
            path: this.getPath(context).push(Model.getKey(true)),
            id: null,
            payload: null,
            options: options
        }, (reponse, err) => {
            if (err) {
                this.getRoot(context).handleError(err);
                return;
            }
            parent.applyWithin(ChildModel, response, options);
        });
    }

    findAll (Model, context, options) {
        return this.makeRequest({
            requestType: 'getMany',
            path: this.getPath(context).push(ChildModel.getKey()),
            id: null,
            payload: null,
            options: options
        }, (response, err) => {
            if (err) {
                this.getRoot(context).handleError(err);
                return;
            }
            context.applyWithin(Model, response, options);
        });
    }

    create (model, context, options) {
        return this.makeRequest({
            requestType: 'create',
            path: this.getPath(context).push(model.getKey()),
            id: null,
            payload: model.toJson(),
            options: options
        }, (response, err) => {
            if (err) {
                this.getRoot(context).handleError(err);
                return;
            }
            model.apply(response, options);
        });
    }

    update (model, options) {
        return this.makeRequest({
            requestType: 'update',
            path: this.getPath(model),
            id: model.id,
            payload: model.toJson({excludeUnchanged: this.options.excludeUnchanged}),
            options: options
        }, (reponse, err) => {
            if (err) {
                this.getRoot(model).handleError(err);
                return;
            }
            model.apply(response, options);
        });
    }

    destroy (model, options) {
        return this.makeRequest({
            requestType: 'destroy',
            path: this.getPath(model),
            id: model.id,
            payload: null,
            options: options
        }, (response, err) => {
            if (err) {
                this.getRoot(model).handleError(err);
                return;
            }
            model.applyDestroy();
        });
    }
}

module.exports = Adapter;
