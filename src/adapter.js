/* @flow */

'use strict';

const defaultOptions = {
    excludeUnchanged: false
};

class Adapter {

    options: Object;

    constructor (options: ?Object) {
        this.options = Object.assign({}, defaultOptions, options || {});
    }

    getAncestry (model: Object): Array<Object> {
        let modelScope = model.getScope();

        if (!modelScope) {
            return [];
        }

        return this.getAncestry(modelScope).concat(model);
    }

    getPathObject (model: any): Object {
        if (Array.isArray(model)) {
            return model.map(this.getPathObject);

        } else if (model.constructor.getKey) {
            return {
                key: model.constructor.getKey(),
                id: model.id,
                keySingular: model.constructor.getKey(true)
            };

        } else if (model.getKey) {
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

    getPath (model: Object): any {
        const ancestory = this.getAncestry(model);
        return this.getPathObject(ancestory);
    }

    getRoot (model: Object): Object {
        return this.getAncestry(model)[0];
    }

    makeRequest (request: Object, callback: Function): void {
        throw new Error('makeRequest is virtual and must be overriden.');
    }

    fetch (model: Object, options: ?Object, callback: Function): void {
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

            callback(response);
        });
    }

    fetchWithin (Model: Function, context: Object, options: ?Object, callback: Function): void {
        return this.makeRequest({
            requestType: 'getOne',
            path: this.getPath(context).push(Model.getKey(true)),
            id: null,
            payload: null,
            options: options
        }, (response, err) => {
            if (err) {
                this.getRoot(context).handleError(err);
                return;
            }

            callback(response);
        });
    }

    findAll (Model: Function, context: Object, options: ?Object, callback: Function): void {
        return this.makeRequest({
            requestType: 'getMany',
            path: this.getPath(context).push(Model.getKey()),
            id: null,
            payload: null,
            options: options
        }, (response, err) => {
            if (err) {
                this.getRoot(context).handleError(err);
                return;
            }

            callback(response);
        });
    }

    create (model: Object, context: Object, options: ?Object, callback: Function): void {
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

            callback(response);
        });
    }

    update (model: Object, options: ?Object, callback: Function):any {
        return this.makeRequest({
            requestType: 'update',
            path: this.getPath(model),
            id: model.id,
            payload: model.toJson({excludeUnchanged: this.options.excludeUnchanged}),
            options: options
        }, (response, err) => {
            if (err) {
                this.getRoot(model).handleError(err);
                return;
            }

            callback(response);
        });
    }

    destroy (model: Object, options: ?Object, callback: Function):any {
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

            callback(response);
        });
    }
}

module.exports = Adapter;
