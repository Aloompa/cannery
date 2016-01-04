const value = Symbol();

class BaseType {

    constructor (options = {}) {

        Object.assign(this, options);

        Object.keys(options.hooks || {}).forEach((key) => {
            const originalMethod = this[key];

            this[key] = function () {
                const val = originalMethod.apply(this, arguments);
                return options.hooks[key](val);
            };
        });
    }

    get () {
        return this[value];
    }

    set (val) {
        this[value] = val;
        return this;
    }

}

module.exports = BaseType;
