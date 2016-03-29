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

    getPathObject (model: any, context: any): Object {
        if (Array.isArray(model)) {
            return model.map(this.getPathObject, true, context);

        } else if (model.constructor.getKey) {
            let obj = {
                id: null,
                key: model.constructor.getKey(false, true, context),
                keySingular: model.constructor.getKey(true, true, context)
            };

            if (model.id) {
                obj.id = model.id;
            }

            return obj;

        } else if (model.getKey) {
            return {
                key: model.getKey(false, true, context),
                keySingular: model.getKey(true, true, context)
            };

        } else {
            return {
                key: model.toString()
            };
        }
    }

    getPath (model: Object, context: Object): any {
        const ancestory = this.getAncestry(model);
        return this.getPathObject(ancestory, context || model);
    }

    getRoot (model: Object): Object {
        return this.getAncestry(model)[0];
    }

    makeRequest (request: Object, callback: Function): void {
        throw new Error('makeRequest is virtual and must be overriden.');
    }

    fetch (model: Object, options: ?Object, callback: Function): void {

        const path = this.getPath(model);

        return this.makeRequest({
            requestType: 'fetch',
            path: path,
            payload: null,
            options: options,
            Model: model.constructor
        }, (response, err) => {
            if (err) {
                model.emit('error', err);
            }

            callback(response, err);
        });
    }

    fetchWithin (Model: Function, context: Object, options: ?Object, callback: Function): void {
        const path = this.getPath(context);
        path.push(this.getPathObject(Model, context));

        return this.makeRequest({
            requestType: 'fetchWithin',
            path: path,
            payload: null,
            options: options,
            Model: Model
        }, (response, err) => {
            if (err) {
                context.emit('error', err);
            }

            callback(response, err);
        });
    }

    findAll (Model: Function, context: Object, options: ?Object, callback: Function): void {
        const path = this.getPath(context);
        path.push(this.getPathObject(Model, context));

        return this.makeRequest({
            requestType: 'findAll',
            path: path,
            payload: null,
            options: options,
            Model: Model
        }, (response, err) => {
            if (err) {
                context.emit('error', err);
            }

            callback(response, err);
        });
    }

    create (model: Object, context: Object, options: ?Object, callback: Function): void {
        const path = this.getPath(context);
        path.push(this.getPathObject(model, context));

        return this.makeRequest({
            requestType: 'create',
            path: path,
            id: null,
            payload: model.toJSON({
                saving: true
            }),
            options: options,
            Model: model.constructor
        }, (response, err) => {
            if (err) {
                context.emit('saveError', err);
            }

            callback(response, err);
        });
    }

    update (model: Object, context: Object, options: ?Object, callback: Function): void {
        return this.makeRequest({
            requestType: 'update',
            path: this.getPath(model, context),
            id: model.id,
            payload: model.toJSON({
                saving: true,
                excludeUnchanged: this.options.excludeUnchanged
            }),
            options: options,
            Model: model.constructor
        }, (response, err) => {
            if (err) {
                model.emit('saveError', err);
            }

            callback(response, err);
        });
    }

    destroy (model: Object, options: ?Object, callback: Function): void {
        return this.makeRequest({
            requestType: 'destroy',
            path: this.getPath(model),
            payload: null,
            options: options,
            Model: model.constructor
        }, (response, err) => {
            if (err) {
                model.emit('deleteError', err);
            }

            callback(response, err);
        });
    }
}

module.exports = Adapter;
