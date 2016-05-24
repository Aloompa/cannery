/* @flow */

'use strict';

const EventEmitter = require('cannery-event-emitter');
const validate = require('valid-point');

class BaseType extends EventEmitter {

    constructor (parentModel: Object, options: Object = {}) {
        super();

        this._options = options;
        this._parent = parentModel;
        this.state = {};

        this.validations = options.validations;
        this._applyHooks(options.hooks);

        if (parentModel && parentModel.emit) {
            this.on('*', function () {
                parentModel.emit(...arguments);
            });
        }

    }

    getParent () {
        return this._parentObject || this._parent;
    }

    setState (key: string, value: any): Object {
        this.state[key] = value;
        this.emit('change');

        return this;
    }

    getState (key: string): any {
        return this.state[key];
    }

    apply (val: any): Object {
        this._value = val;
        this.emit('change');

        return this;
    }

    get (key: any): any {
        return this._value;
    }

    set (val: any): ?Object {
        this._value = val;
        this.validate();
        this.emit('change');
        this.emit('userChange');
        return this;
    }

    toJSON (): ?Object {
        return this._value;
    }

    validate (): any {
        if (this.validations) {
            this.setState('error', null);

            // Apply this context of the parent object to each validation.
            // Otherwise it will be difficult to access
            Object.keys(this.validations).forEach((validationType) => {
                if (typeof this.validations[validationType] === 'object') {
                    this.validations[validationType].fn = this.validations[validationType].fn.bind(
                        this.getParent()
                    );
                }
            });

            try {
                validate({
                    data: {
                        [ this.fieldName ]: this._value
                    },
                    validations: {
                        [ this.fieldName ]: this.validations
                    }
                });

            } catch (e) {
                this.setState('error', e.message);
                return e.message;
            }
        }
    }

    _applyListeners () {
        const { on } = this._options;
        const parent = this.getParent();

        if (on) {
            Object.keys(on).forEach((eventName) => {
                this.on(eventName, on[eventName].bind(parent));
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
