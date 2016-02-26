/* @flow */

const ObjectType = require('./types/object');

class Root {

    _fields: Object;

    constructor () {
        this._fields = new ObjectType(this, this.getFields(...arguments), {
            parent: this
        });
    }

    define (Type: Function, ...args: any): Object {
        return () => {
            return new Type(this, ...args);
        };
    }

    getFields (): any {
        throw new Error('The getFields() method is not defined on the Root');
    }

    get (key: string): any {
        return this._fields.get(key);
    }

    set (key: string, value: any): Object {
        this._fields.set(key, value);
        return this;
    }

}

module.exports = Root;
