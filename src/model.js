/* @flow */

'use strict';

const ObjectType = require('./types/object');
const Adapter = require('./adapters/sessionAdapter');
const OwnsMany = require('./types/ownsMany');

class Model {

    id: string;
    options: ?Object;
    _parent: Object;
    _fields: Object;
    state: Object;

    static getKey (singular: ?boolean) {
        const name = this.name.toLowerCase();
        return (singular) ? name: `${name}s`;
    }

    static getFieldId () {
        return 'id';
    }

    constructor (parentModel: Object, id: string, options: ?Object) {

        this._parent = parentModel;
        this.id = id;

        const fields = this.getFields(...arguments);

        this._fields = new ObjectType(this, fields, {
            parent: this
        });

        this.options = options;
        this.state = {};
    }

    setState (key: string, value: any): Object {
        this.state[key] = value;
        this.emit('change');

        return this;
    }

    getState (key: string): any {
        return this.state[key];
    }

    apply (data: Object): Object {
        const responseId = data[this.constructor.getFieldId()];

        if (!this.id) {
            this.id = responseId;
        }

        this._fields.apply(data);

        return this;
    }

    define (Type: Function, ...args: any): Function {
        const fn = () => {
            return new Type(this, ...args);
        };

        fn.Type = Type;
        fn.typeArguments = [...args];

        return fn;
    }

    // TODO: Move this into the destroy() method once the test adapter lets us mock responses
    _afterDestroy (response: any) {
        const ownsManyOwner = this.findOwnsMany(this.constructor);

        if (ownsManyOwner) {
            ownsManyOwner.remove(this);
        }

        this.setState('isDestroyed', true);
    }

    destroy (options: Object = {}): Object {
        this.getAdapter()
            .destroy(this, this.getScope(), options, (response) => {
                this._afterDestroy(response);
            });

        return this;
    }

    get (key: string): Object {
        return this._fields.get(key);
    }

    getScope (): Object {
        return this._parent;
    }

    findOwnsMany (Model: Function) {
        let parent = this.getScope();

        while (parent) {
            const fields = parent.getFields();

            for (let key in fields) {
                const field = fields[key];

                if (field.Type === OwnsMany && field.typeArguments[0] === Model) {
                    return parent.get(key);
                }
            }

            parent = parent.getScope();
        }
    }

    getAdapter (): Object {
        return this.getScope().getAdapter(...arguments);
    }

    getFields (): Object {
        throw new Error('The getFields() method is not defined');
    }

    off (): any {
        return this._fields.off(...arguments);
    }

    on (): Function {
        return this._fields.on(...arguments);
    }

    emit (): Object {
        this._fields.emit(...arguments);

        return this;
    }

    set (key: string, value: any): Object {
        this._fields.set(key, value);
        this.setState('isChanged', true);
        return this;
    }

    toJSON (options: ?Object): Object {
        return this._fields.toJSON(options);
    }

    validate (key: ?string): Object {
        this._fields.validate(key);
        return this;
    }

    save (options: Object = {}, single: boolean = false): Object {
        const saveType = (this.id) ? 'update' : 'create';

        if (!this.getState('isChanged')) {
            return this;
        }

        try {
            this.validate();

        } catch (e) {
            this.emit('saveError', e);
            return this;
        }

        this.setState('saving', true);

        this.getAdapter()
            [saveType](this, this.getScope(), options, (response) => {
                this.setState('saving', false);
                this.setState('isChanged', false);
                this.apply(response);
            });

        return this;
    }

    create (): Object {
        const Field = this.define(...arguments);
        return new Field();
    }
}

module.exports = Model;
