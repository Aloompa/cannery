/* @flow */

const EventEmitter = require('cannery-event-emitter');
const snakeCase = require('lodash.snakecase');
const pluralize = require('pluralize');
const ObjectType = require('./types/object');
const debounce = require('lodash.debounce');
const RestAdapter = require('./adapters/RESTAdapter');

class Root extends EventEmitter {

    _fields: Object;

    constructor () {
        super();

        const fields = this.getFields(...arguments);

        this._fields = new ObjectType(this, fields, {
            parent: this
        });

        this.adapter = new RestAdapter();
    }

    getAdapter () {
        return this.adapter;
    }

    apply (data: Object): Object {
        this._fields.apply(data);
        return this;
    }

    define (Type: Function, ...args: any): Object {
        const fn = () => {
            return new Type(this, ...args);
        };

        fn.Type = Type;
        fn.typeArguments = [...args];

        return fn;
    }

    create (): Object {
        const Field = this.define(...arguments);
        return new Field();
    }

    getFields (): Object {
        throw new Error('The getFields() method is not defined on the Root');
    }

    getScope (): null {
        return null;
    }

    findOwnsMany (): null {
        return null;
    }

    get (key: string): any {
        return this._fields.get(key);
    }

    set (key: string, value: any): Object {
        this._fields.set(key, value);
        return this;
    }

    toJSON (options: ?Object): Object {
        return this._fields.toJSON(options);
    }

}

module.exports = Root;
