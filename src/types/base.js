/* @flow */

'use strict';

const EventEmitter = require('cannery-event-emitter');
const validate = require('valid-point');

class BaseType extends EventEmitter {

    constructor (parentModel: Object, options: Object = {}) {
        super();

        this._parent = parentModel;

        this.validations = options.validations;
        this._applyHooks(options.hooks);

        if (parentModel && parentModel.emit) {
            this.on('*', function () {
                parentModel.emit(...arguments);
            });
        } else {
            console.log('NO PARENT', parentModel);
        }

    }

    apply (val: any): Object {
        this._value = val;
        this.emit('change');

        return this;
    }

    get (key: any): any {
        return this._value;
    }

    set (val: any): Object {
        this._value = val;
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

    _applyHooks (hooks: Object = {}) {
        Object.keys(hooks).forEach((key) => {
            const originalMethod = this[key];

            if (key === 'apply' || key === 'set') {
                this[key] = function (val) {
                    return originalMethod.call(this, hooks[key](val));
                };

                return;
            }

            this[key] = function () {
                const val = originalMethod.apply(this, arguments);
                return hooks[key](val);
            };
        });
    }

}

module.exports = BaseType;
