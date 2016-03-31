/* @flow */

'use strict';

const EventEmitter = require('cannery-event-emitter');
const snakeCase = require('lodash.snakecase');
const pluralize = require('pluralize');
const ObjectType = require('./types/object');
const Adapter = require('./adapters/sessionAdapter');
const OwnsMany = require('./types/ownsMany');
const OwnsOne = require('./types/ownsOne');

class Model extends EventEmitter {

    id: string;
    options: ?Object;
    _parent: Object;
    _fields: Object;
    state: Object;

    constructor (parentModel: Object, id: string, options: ?Object) {
        super();

        if (!parentModel) {
            throw new Error('Models cannot be created without belonging to another model or root above them');
        }

        this._parent = parentModel;

        this.id = id;

        const fields = this.getFields(...arguments);

        this._fields = new ObjectType(this, fields, {
            parent: this
        });

        this.options = options;
        this.state = {};

        this.on('userChange', () => {
            this.setState('isChanged', true);
        });

        this.on('*', function () {
            parentModel.emit(...arguments);
        });
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
            this.id = String(responseId);
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

    destroy (options: Object = {}): Object {
        this.getRoot().requestCache.clear(this.constructor);

        this.getAdapter()
            .destroy(this, options, (response) => {
                this.emit('destroy', this);
                this.emit('change');
            });
        return this;
    }

    get (key: string): Object {
        return this._fields.get(key);
    }

    getScope (): Object {
        return this._parent;
    }

    getRoot (): Object {
        let root = this.getScope();

        while (root.getScope()) {
            root = root.getScope();
        }

        return root;
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

        try {
            this.validate();

        } catch (e) {
            this.emit('saveError', e);
            return this;
        }

        this.setState('saving', true);

        this.getAdapter()
            [saveType](this, this.getScope(), options, (response) => {

                // If we created a model, add the model to the ownsMany that contains the model type
                if (saveType === 'create') {

                    const ownsManyOwner = this.findOwnsMany(this.constructor);

                    if (ownsManyOwner) {
                        const fieldId = this.constructor.getFieldId();
                        const id = response[fieldId];

                        this.id = id;
                        ownsManyOwner.modelStore.addExisting(this, id);
                        ownsManyOwner.map.add(id);
                    }
                }

                if (saveType === 'create') {
                    this.apply(response);
                }

                this.setState('saving', false);
                this.setState('isChanged', false);
            });

        if (saveType === 'create') {
            this.getRoot().requestCache.clear(this.constructor);
        }

        return this;
    }

    create (): Object {
        const Field = this.define(...arguments);
        return new Field();
    }

    static getKey (singular: ?Boolean): String {
        const singularKey = snakeCase(this.name);

        if (singular) {
            return singularKey;
        } else {
            return pluralize.plural(singularKey);
        }
    }

    static getFieldId () {
        return 'id';
    }
}

module.exports = Model;
