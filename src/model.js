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

        this.on('*', function () {
            parentModel.emit(...arguments);
        });

        this.on('saveError', () => {
            this.setState('saving', false);
        });

        this.on('userChange', () => {
            this.setState('isChanged', true);
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

    apply (data: Object, options: Object = {}): Object {
        const responseId = data[this.constructor.getFieldId()];

        if (!this.id) {
            this.id = responseId;
        }

        this._fields.apply(data, options);

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
        this.getAdapter()
            .destroy(this, options, (response) => {
                const ownsManyOwner = this.findOwnsMany(this.constructor);

                if (ownsManyOwner) {
                    ownsManyOwner._remove(this);
                }

                this.setState('isDestroyed', true);
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
        return this;
    }

    toJSON (options: ?Object): Object {
        return this._fields.toJSON(options);
    }

    validate (key: ?string): Object {
        this._fields.validate(key);
        return this;
    }

    _saveSuccess (response) {
        const saveType = (this.id) ? 'update' : 'create';

        // If we created a model, add the model to the ownsMany that contains the model type
        if (saveType === 'create') {

            const ownsManyOwner = this.findOwnsMany(this.constructor);

            if (ownsManyOwner) {
                const fieldId = this.constructor.getFieldId();
                const id = response[fieldId];

                if (!this.id) {
                    this.id = id;
                }

                ownsManyOwner._models[id] = this;
                ownsManyOwner.map.add(id);
            }
        }

        this.apply(response);

        this.setState('saving', false);
        this.setState('isChanged', false);

        this.emit('saveSuccess');
        this.emit('change');
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
            [saveType](this, this.getScope(), options, this._saveSuccess.bind(this));

        return this;
    }

    create (): Object {
        const Field = this.define(...arguments);
        return new Field();
    }

    static getKey (singular: ?Boolean, uri: ?Boolean): String {
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
