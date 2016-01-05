const EventEmitter = require('cannery-event-emitter');
const validate = require('valid-point');
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

        this.validations = options.validations;
    }

    apply (val) {
        this[value] = val;
        return this;
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

    toJSON () {
        return this.get();
    }

    validate () {
        if (this.validations) {
            return validate({
                data: {
                    [ this.fieldName ]: this.get()
                },
                validations: {
                    [ this.fieldName ]: this.validations
                }
            });
        }
    }

}

module.exports = BaseType;
