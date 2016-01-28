const cache = Symbol();

class RequestCache {
    constructor () {
        this[cache] = {};
    }

    getKey (options) {
        if (!options || Object.keys(options) === []) {
            return '_no-options';
        }

        return JSON.stringify(options);
    }

    get (options) {
        const key = this.getKey(options);
        return this[cache][key];
    }

    set (options, data) {
        const key = this.getKey(options);
        this[cache][key] = data || [];
    }

    clear (options) {
        if (options) {
            const key = this.getKey(options);
            delete this[cache][key];
        } else {
            this[cache] = {};
        }
    }
}

module.exports = RequestCache;
