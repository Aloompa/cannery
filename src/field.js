const debug              = require('debug')('cannery-field');
const validate           = require('valid-point');
const EventEmitter       = require('cannery-event-emitter');

const noop = () => {};

class Field extends EventEmitter {

    constructor ({ fields, data, change, userChange, rootUrl }) {
        super({
            throttle: 50
        });

        this.on('change', change || noop);
        this.on('userChange', userChange || noop);
        this.rootUrl = rootUrl;
        this._fields = fields;
        this._objectFields = {};

        this.initialize(data);
    }

    initialize (data) {
        this._data = this.applyData(data);

        for (let field in this._objectFields) {
            if (!this._fields[field].model) {
                this._objectFields[field].initialize(this._data[field]);
            }
        }
    }

    // TOOD: Make private
    applyData (data) {
        let obj = {};
        for (let key in data) {

            /* istanbul ignore else */
            if (data.hasOwnProperty(key)) {
                if (
                    this._fields[key] &&
                    this._fields[key].hooks &&
                    this._fields[key].hooks.pullFilter
                ) {
                    obj[key] = this._fields[key].hooks.pullFilter(data[key]);

                } else {
                    obj[key] = data[key];
                }
            }
        }

        return obj;
    }

    // TOOD: Make private
    applyHook (hook, field, value) {
        let hooks = this._fields[field].hooks;

        if (hooks && hooks[hook]) {
            return hooks[hook](value, field);
        } else {
            return value;
        }
    }

    // TOOD: Make private
    trickleSave () {
        let promises = [];
        Object.keys(this._fields).forEach((name) => {
            let field = this._fields[name];
            if (field.model && field.userChanged && !field.saveAs) {
                let model = this._objectFields[name];
                let save;

                // One to one relationships
                if (field.type === 'object') {
                    save = model.save().then((response) => {
                        field.userChanged = false;
                        return response;
                    });

                    promises.push(save);

                // One to many relationships
                } else {
                    this._data[name].forEach((model) => {
                        field.userChanged = false;
                        save = model.save();
                        promises.push(save);
                    });
                }

            } else if (field.model && field.type === 'array') {
                let models = this.get(name);

                models.forEach((model) => {
                    if (!model.id) {
                        promises.push(model.create().then((response) => {
                            const { id } = response;
                            this._data[field.map].push(id);

                            return response;
                        }));
                    }
                });
            }
        });

        return Promise.all(promises);
    }

    getType (field) {
        return this._fields[field].type;
    }

    // TOOD: Make private
    findModel (field) {
        return this._fields[field].model;
    }

    isType (field, type) {
        return this.getType(field) === type;
    }

    getFields (field) {
        return this._fields[field].fields;
    }

    mute () {
        this._silent = true;
        return this;
    }

    unmute () {
        this._silent = false;
        return this;
    }

    validate (field) {

        if (!field) {
            let validations = {};

            Object.keys(this._fields).map((fieldName) => {
                const validation = this._fields[fieldName].validation;
                if (validation) {
                    validations[fieldName] = validation;
                }
            });

            return validate({
                data: this.toJSON(),
                validations
            });

        } else if (this._fields[field]) {
            this._data[field] = this.get(field);

            return validate({
                data: {
                    [field]: this._data[field]
                },
                validations: {
                    [field]: this._fields[field].validation
                }
            });

        } else {
            throw new Error(`Trying to validate a nonexistent field ${field}`);
        }

    }

    getModelsSingleRequest (field, options = {}) {
        if (!this._objectFields[field]) {
            let mapping = this._fields[field].map || this._fields[field].mapping;
            let id = this._data[mapping];
            let modelId = this.id || this.get('id');
            let all = this._fields[field].all;

            if (!modelId) {
                return [];
            }

            if (typeof this._fields[field].getUrl !== 'function') {
                this._fields[field].getUrl = () => {
                    return `${this.rootUrl}/${modelId}/${field}`;
                };
            }

            if (!all) {
                let model = this.findModel(field);
                all = model.all.bind(
                    model
                );
            }

            options.url = this._fields[field].getUrl();

            if (!mapping || (this.get(mapping) && this.get(mapping).length)) {
                all(options).then((data) => {
                    this._data[field] = data;
                    this._data[field]._fetched = true;
                    this._objectFields[field] = true;
                    this.emit('change');

                    this._data[field].forEach((model) => {
                        model.on('change', () => {
                            this.emit('change');
                        });

                        model.on('userChange', () => {
                            this._fields[field].userChanged = true;
                            this.emit('userChange');
                        });
                    });

                }).catch((e) => {
                    debug(e);
                });
            } else {
                this._data[field] = this._data[field] || [];
                this._data[field]._fetched = true;
            }
        }

        return this._data[field] || [];
    }

    getModelsMultipleRequests (field, options) {

        const ids = this.get(this._fields[field].map);

        this._objectFields[field] = this._objectFields[field] || {};

        this._data[field] = this._data[field] || [];

        // Just in case a new change slips by
        this._data[field].forEach((model) => {
            this._objectFields[field][model.id] = true;
        });

        ids.forEach((id) => {
            if (!this._objectFields[field][id]) {
                const Model = this._fields[field].model;
                const model = new Model(id);
                this._objectFields[field][id] = true;
                this._data[field].push(model);

                model.on('change', () => {
                    this.emit('change');
                });

                model.on('userChange', () => {
                    this.emit('userChange');
                });
            }
        });

        return this._data[field];
    }

    getModels (field, options = {}) {

        if (this._fields[field].requestType === 'single') {
            return this.getModelsMultipleRequests(field, options);
        }

        return this.getModelsSingleRequest(field, options);
    }

    getModel (field) {
        let mapping = this._fields[field].map || this._fields[field].mapping || `${field}_id`;
        let id = this._data[mapping];

        if (!this._objectFields[field]) {

            let Model = this.findModel(field);
            let model = new Model(id);

            model.on('change', () => {
                this.emit('change');
            });

            model.on('userChange', () => {
                this._fields[field].userChanged = true;
                this.emit('userChange');
            });

            this._objectFields[field] = model;
        }

        this._objectFields[field].id = id;

        return this._objectFields[field];
    }

    // TOOD: Make private
    getArray (field) {
        let arr = [];

        this._data[field] = this._data[field] || [];

        // Flat arrays
        if (!this.getFields(field)) {
            return this._data[field];
        }

        // Nested arrays
        Object.keys(this._data[field]).forEach((key) => {
            let data = this._data[field][key];

            arr.push(new Field({
                data: data,
                fields: this.getFields(field)
            }));
        });

        return arr;
    }

    // TOOD: Make private
    getObject (field) {
        if (!this._objectFields[field]) {
            this._objectFields[field] = new Field({
                data: this._data[field] || {},
                fields: this.getFields(field)
            });

            this._objectFields[field].on('change', () => {
                this.emit('change');
            });
            this._objectFields[field].on('userChange', () => {
                this.emit('userChange');
            });
        }

        return this._objectFields[field];
    }

    getValue (field, options) {

        if (this._fields[field]) {

            // Nested Arrays
            if (this.isType(field, 'array')) {
                if (this.findModel(field)) {
                    return this.getModels(field, options);
                }

                return this.getArray(field);
            }

            // Nested Objects
            if (this.isType(field, 'object')) {
                if (this.findModel(field)) {
                    return this.getModel(field);
                }

                return this.getObject(field);
            }

            // Booleans
            if (this.isType(field, 'boolean')) {
                if (this._data[field] === 'false') {
                    return false;
                }

                return Boolean(this._data[field]);
            }

            // Singletons
            return this._data[field];
        }
    }

    get (field, options) {
        if (this._fields[field]) {
            if (this._fields[field].hooks && this._fields[field].hooks.get) {
                return this._fields[field].hooks.get(this.getValue(field, options));
            }

            return this.getValue(field, options);
        }
    }

    set (field, value) {
        if (this.isType(field, 'array') && this._fields[field].fields) {
            throw new Error('You cannot directly set to an array. Use add() and remove() to modify the array.');
        }

        if (this.isType(field, 'object')) {
            throw new Error('You cannot directly set to an object. Get the sub-items and set them instead.');
        }

        this._data[field] = this.applyHook('set', field, value);
        this._fields[field].touched = true;

        if (!this._silent) {
            this.emit('userChange');
            this.emit('change');
        }

        return this;
    }

    add (field, item, index) {
        if (!this.isType(field, 'array')) {
            throw new Error('Cannot add() to a non-array field');
        }

        this._data[field] = this._data[field] || [];

        // Keep the user from needing to new up the model
        if (this._fields[field].model && !item.get) {
            item = new this._fields[field].model(item);
        }

        // If no index is provided, append to the end of the array
        if (typeof index !== 'number') {
            index = this._data[field].length;
        }

        this._data[field].splice(index, 0, item);
        this._fields[field].touched = true;

        this.emit('userChange');

        if (typeof item === 'object' && item.on) {
            item.on('userChange', () => {
                this.emit('userChange');
            });
        }

        return this;
    }

    move (field, oldIndex, newIndex) {
        if (!this.isType(field, 'array')) {
            throw new Error('Cannot move() a non-array field');
        }

        let item = this._data[field][oldIndex];
        this._data[field].splice(oldIndex, 1);
        this._data[field].splice(newIndex, 0, item);
        this._fields[field].touched = true;

        this.emit('userChange');

        return this;
    }

    removeAll (field) {
        this._data[field] = [];
        this.emit('change');
        return this;
    }

    removeById (field, id) {
        this.get(field).forEach((item, i) => {
            if (item.get('id') === id) {
                this.remove(field, i);
            }
        });
    }

    findById (field, id) {
        let result = null;

        this.get(field).forEach((item, i) => {
            if (item.get('id') === id) {
                result = item;
            }
        });

        return result;
    }

    remove (field, item) {

        let index;

        if (!this.isType(field, 'array')) {
            throw new Error('Cannot remove() from a non-array field');
        }

        // Remove based on an index
        if (typeof item === 'number' && typeof this._data[field][0] !== 'number') {
            index = item;

        // Remove based on an the item position
        } else {
            index = this._data[field].indexOf(item);
        }

        // Remove from the array
        this._data[field].splice(index, 1);
        this._fields[field].touched = true;

        // Emit changes
        this.emit('userChange');

        return this;
    }

    toJSON () {
        let data = {};

        for (let field in this._fields) {

            /* istanbul ignore else */
            if (this._fields.hasOwnProperty(field)) {

                if (this._fields[field].touched && this._fields[field].map && this._data[field]) {
                    this._data[this._fields[field].map] = this._data[field].map((model) => {
                        return model.id;
                    });
                }

                // Save nested models in the same call
                if (this._fields[field].saveAs) {
                    data[this._fields[field].saveAs] = this.get(field).toJSON();

                    continue;
                }

                if (this._fields[field].model) {
                    continue;
                }

                if (this._fields[field].toJSON === false) {
                    continue;
                }

                // If the field has a push filter, we'll use that
                if (
                    this._fields[field].hooks &&
                    this._fields[field].hooks.pushFilter
                ) {
                    data[field] = this._fields[field].hooks.pushFilter(this._data[field]);

                // Nested objects
                } else if (this._fields[field] && this._fields[field].type === 'object') {
                    data[field] = this.get(field).toJSON();

                // If there is no push filter, just return the data unfiltered
                } else {
                    data[field] = this._data[field];
                }
            }
        }

        return data;
    }

}

module.exports = Field;
