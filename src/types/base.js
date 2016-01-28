'use strict';

const EventEmitter = require('cannery-event-emitter');
const validate = require('valid-point');
const value = Symbol();

class BaseType extends EventEmitter {

    constructor (options = {}) {

        super();

        this.lastModified = new Date().getTime();

        Object.assign(this, options);

        Object.keys(options.hooks || {}).forEach((key) => {
            const originalMethod = this[key];

            if (key === 'apply' || key === 'set') {
                this[key] = function (val) {
                    return originalMethod.call(this, options.hooks[key](val));
                };

                return;
            }

            this[key] = function () {
                const val = originalMethod.apply(this, arguments);
                return options.hooks[key](val);
            };
        });

        this.validations = options.validations;
    }

    apply (val) {
        if (!this.isValueChanged(val)) {
            return this;
        }

        this[value] = val;
        this.lastModified = new Date().getTime();
        this.emit('change');

        return this;
    }

    get () {
        return this[value];
    }

    isValueChanged (val) {
        return this[value] !== val;
    }

    set (val) {
        if (!this.isValueChanged(val)) {
            return this;
        }

        this[value] = val;
        this.lastModified = new Date().getTime();
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
