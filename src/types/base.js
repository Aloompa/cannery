const EventEmitter = require('cannery-event-emitter');
const value = Symbol();

class BaseType extends EventEmitter {

    constructor (options = {}) {

        super();

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
        this.emit('change');
        this.emit('userChange');
        return this;
    }

    apply (val) {
        this[value] = val;
        return this;
    }

    toJSON () {
        return this.get();
    }

}

module.exports = BaseType;
