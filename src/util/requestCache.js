/* @flow */

class RequestCache {
    constructor () {
        this.data = {};
    }

    set (Model: Function, context: Object, query: ?Object = {}, ids: Array) : void {
        if (!Model || !context) {
            throw new TypeError('RequestCache.set(): Model and context are not optional');
        }

        const normalizedIds = ids.map(String);
        const modelKey = this._modelKey(Model);
        const contextKey = this._contextKey(context);
        const queryKey = this._queryKey(query);

        this._initialize(Model, context, query);
        this.data[modelKey][contextKey][queryKey] = normalizedIds;
    }

    get (Model: Function, context: Object, query: ?Object = {}) : Array {
        if (!Model || !context) {
            throw new TypeError('RequestCache.set(): Model and context are not optional');
        }

        const modelKey = this._modelKey(Model);
        const contextKey = this._contextKey(context);
        const queryKey = this._queryKey(query);

        this._initialize(Model, context);
        return this.data[modelKey][contextKey][queryKey];
    }

    clear (Model: Function) {
        const modelKey = this._modelKey(Model);
        this.data[modelKey] = {};
    }

    _modelKey(Model: Function) : String {
        return Model.getKey();
    }

    _contextKey(context: Object) : String {
        return `${context.constructor.getKey()}:${context.id}`;
    }

    _queryKey(query: Object) : String {
        return JSON.stringify(query);
    }

    _initialize (Model: Function, context: ?Object, query: ?Object) : Any {
        const modelKey = this._modelKey(Model);
        if (!data[modelKey]) {
            data[modelKey] = {};
        }
        const modelData = data[modelKey];

        if (!context) {
            return;
        }
        const contextKey = this._contextKey(context);
        if(!modelData[contextKey]) {
            modelData[contextKey] = {};
        }
        const contextData = modelData[contextKey];

        if (!query) {
            return;
        }
        const queryKey = this._queryKey(query);
        if (!contextData[queryKey]) {
            contextData[queryKey] = [];
        }
    }
}

module.exports = RequestCache;
