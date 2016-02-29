/* @flow */

const EventEmitter = require('cannery-event-emitter');
const ObjectType = require('./types/object');

class Root extends EventEmitter {

    constructor () {
        super();
        
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

    get (key: string): any {
        return this._fields.get(key);
    }

    set (key: string, value: any): Object {
        this._fields.set(key, value);
        return this;
    }

    toJSON (): Object {
        return this._fields.toJSON();
    }

}

module.exports = Root;
