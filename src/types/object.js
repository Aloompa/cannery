const parseFields = require('../util/parseFields');
const extendHooks = require('../util/extendHooks');
const EventEmitter = require('cannery-event-emitter');

module.exports = (fields, options = {}) => {

    class ObjectType extends EventEmitter {

        constructor () {
            super();

            this.type = 'object';

            Object.assign(this, options);

            this.fields = parseFields(fields);

            this.hooks = this.getHooks();
        }

        getHooks () {
            return extendHooks(options.hooks, {

                get: (key) => {
                    return this.fields[key].hooks.get();
                },

                set: (key, value) => {
                    this.fields[key].hooks.set(value);
                    this.emit('change');
                    this.emit('userChange');
                    return this;
                }

            });
        }

    }

    return new ObjectType();
};
