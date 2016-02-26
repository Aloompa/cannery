/* @flow */

'use strict';

const EventEmitter = require('cannery-event-emitter');
const validate = require('valid-point');

class BaseType extends EventEmitter {

    constructor (owner: Object, options: Object = {}) {
        super();

        this.lastModified = new Date().getTime();
        this.owner = owner;

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

    apply (val: any): Object {
        if (!this.isValueChanged(val)) {
            return this;
        }

        this._value = val;
        this.lastModified = new Date().getTime();
        this.emit('change');

        return this;
    }

    get (key: any): any {
        return this._value;
    }

    isValueChanged (val: any): boolean {
        return this._value !== val;
    }

    set (val: string): Object {
        if (!this.isValueChanged(val)) {
            return this;
        }

        this._value = val;
        this.lastModified = new Date().getTime();
        this.emit('change');
        this.emit('userChange');
        return this;
    }

    toJSON (): Object {
        return this._value;
    }

    validate (key: string): any {
        if (this.validations) {
            return validate({
                data: {
                    [ this.fieldName ]: this._value
                },
                validations: {
                    [ this.fieldName ]: this.validations
                }
            });
        }
    }

}

module.exports = BaseType;
