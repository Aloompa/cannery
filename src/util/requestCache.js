/* @flow */

class RequestCache {
    constructor () {
        this.data = {};
    }

    set (Model: Function, context: Object, query: ?Object = {}, ids: Array = []) : void {
        if (!Model || !context) {
            throw new TypeError('RequestCache.set(): Model and context are not optional');
        }

        const normalizedIds = ids.map(String);
        const modelKey = this._modelKey(Model);
        const contextKey = this._contextKey(context);
        const queryKey = this._queryKey(query);

        this._initialize(Model, context, query);
        this.data[modelKey][contextKey][queryKey].ids = normalizedIds;
    }

    get (Model: Function, context: Object, query: ?Object = {}) : Array {
        if (!Model || !context) {
            throw new TypeError('RequestCache.get(): Model and context are not optional');
        }

        const modelKey = this._modelKey(Model);
        const contextKey = this._contextKey(context);
        const queryKey = this._queryKey(query);

        let isInitialized = false;

        if (this.data[modelKey] && this.data[modelKey][contextKey] && this.data[modelKey][contextKey][queryKey]) {
            isInitialized = true;
        }

        if (!isInitialized) {
            this._initialize(Model, context, query);
        }

        if (this.data[modelKey][contextKey][queryKey].ids) {
            return this.data[modelKey][contextKey][queryKey].ids;
        }

        return (isInitialized) ? [] : null;
    }

    getMeta (Model: Function, context: Object, query: ?Object = {}) {
        if (!Model || !context) {
            throw new TypeError('RequestCache.getMeta(): Model and context are not optional');
        }

        const modelKey = this._modelKey(Model);
        const contextKey = this._contextKey(context);
        const queryKey = this._queryKey(query);

        this._initialize(Model, context, query);
        return this.data[modelKey][contextKey][queryKey].meta;
    }

    setMeta (Model: Function, context: Object, query: ?Object = {}, data: Object = {}) {
        if (!Model || !context) {
            throw new TypeError('RequestCache.setMeta(): Model and context are not optional');
        }

        const modelKey = this._modelKey(Model);
        const contextKey = this._contextKey(context);
        const queryKey = this._queryKey(query);

        this._initialize(Model, context, query);
        this.data[modelKey][contextKey][queryKey].meta = data;
    }

    clear (Model: Function) {
        const modelKey = this._modelKey(Model);
        this.data[modelKey] = {};
    }

    _modelKey(Model: Function) : String {
        return Model.getKey();
    }

    _contextKey(context: Object) : String {
        if (context.getScope() === null) {
            return 'root'
        } else {
            return `${context.constructor.getKey()}:${context.id}`;
        }
    }

    _queryKey(query: Object) : String {
        let parsedQuery = {};

        Object.keys(query).forEach((key) => {
            if (query[key]) {
                parsedQuery[key] = query[key];
            }
        });

        return JSON.stringify(parsedQuery);
    }

    _initialize (Model: Function, context: ?Object, query: ?Object) : Any {
        const modelKey = this._modelKey(Model);
        if (!this.data[modelKey]) {
            this.data[modelKey] = {};
        }
        const modelData = this.data[modelKey];

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
            contextData[queryKey] = {};
        }
    }
}

module.exports = RequestCache;
