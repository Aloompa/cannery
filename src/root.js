/* @flow */

const EventEmitter = require('cannery-event-emitter');
const snakeCase = require('lodash.snakecase');
const pluralize = require('pluralize');
const ObjectType = require('./types/object');

class Root {

    _fields: Object;

    constructor () {
        
        const fields = this.getFields(...arguments);

        this._fields = new ObjectType(this, fields, {
            parent: this
        });
    }

    apply (data: Object): Object {
        this._fields.apply(data);
        return this;
    }

    define (Type: Function, ...args: any): Object {
        return () => {
            return new Type(this, ...args);
        };
    }

    getFields (): Object {
        throw new Error('The getFields() method is not defined on the Root');
    }

    getScope () {
        return null;
    }

    findOwnsMany () {
        // TODO
    }

    get (key: string): any {
        return this._fields.get(key);
    }

    set (key: string, value: any): Object {
        this._fields.set(key, value);
        return this;
    }

    off (): Object {
        this._fields.off(...arguments);
        return this;
    }

    on (): Function {
        return this._fields.on(...arguments);
    }

    emit (): Object {
        this._fields.emit(...arguments);
        return this;
    }

    toJSON (options: ?Object): Object {
        return this._fields.toJSON(options);
    }

    static getKey () {
        // TODO
    }

    static getKey (singular: ?Boolean): String {
            let singularKey = snakeCase(this.name);

             if (singular) {
                 return singularKey;
             } else {
                 return pluralize.plural(singularKey);
             }
        }
}

module.exports = Root;
