/* @flow */

class RequestCache {

    _cache: Object;

    constructor () {
        this._cache = {};
    }

    getKey (options: Object = {}): string {
        if (!Object.keys(options).length) {
            return '_no-options';
        }

        return JSON.stringify(options.query);
    }

    get (options: Object = {}): Object {
        const key = this.getKey(options);
        return this._cache[key];
    }

    set (options: Object = {}, data: Array<any>) {
        const key = this.getKey(options);
        this._cache[key] = data || [];
    }

    clear (options: ?Object) {
        if (options) {
            const key = this.getKey(options);
            delete this._cache[key];
        } else {
            this._cache = {};
        }
    }
}

module.exports = RequestCache;
