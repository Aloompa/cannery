/* @flow */

const EventEmitter = require('cannery-event-emitter');
const snakeCase = require('lodash.snakecase');
const pluralize = require('pluralize');
const ObjectType = require('./types/object');
const debounce = require('lodash.debounce');
const RestAdapter = require('./adapters/RESTAdapter');
const RequestCache = require('./util/RequestCache');

class Root extends EventEmitter {

    _fields: Object;

    constructor () {
        super();

        const fields = this.getFields(...arguments);

        this.adapter = new RestAdapter();
        this.requestCache = new RequestCache();

        this._fields = new ObjectType(this, fields, {
            parent: this
        });
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

    getRoot (): Object {
        return this;
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
