'use strict';

const EventEmitter = require('cannery-event-emitter');
const BaseType = require('./base');
const ObjectType = require('./object');
const addListenersUtil = require('../util/addListeners');
const isEqual = require('lodash.isequal');
const validate = require('valid-point');
const fields = Symbol();
const Type = Symbol();
const getTyped = Symbol();
const typeOptions = Symbol();
const typedArray = Symbol();

class ArrayType extends EventEmitter {

    constructor (ArrayType, arrayFields, options = {}) {
        super();

        this[typedArray] = [];
        this.Type = ArrayType || BaseType;
        this[fields] = arrayFields;
        this[typeOptions] = options;
        this.validations = options.validations;
        this.set([]);
    }

    add (item, index) {
        let array = this[typedArray].slice(0);
        const typedItem = this.instantiateItem(item);

        typedItem.apply(item);

        addListenersUtil(this, typedItem);

        if (typeof index !== 'number') {
            index = array.length;
        }

        array.splice(index, 0, typedItem);

        this.set(array);

        this.emit('userChange');

        return this;
    }

    all () {
        const arr = this[typedArray].slice(0).map((item) => {

            // Object
            if (item instanceof ObjectType) {
                return item;
            }

            return item.get();
        });

        return arr;
    }

    apply (data) {
        const array = data.map((item) => {

            const typedItem = this.instantiateItem(item);

            typedItem.apply(item);

            return typedItem;

        });

        this.set(array);

        return this;
    }

    forEach (callback) {
        return this.all().forEach(callback);
    }

    get (index) {
        return this.all()[index];
    }

    getType () {
        return this.Type;
    }

    instantiateItem () {
        const instance = new this.Type(Object.assign({}, this[fields]), Object.assign({}, this[typeOptions]));

        instance.on('userChange', () => {
            if (this.parent) {
                this.parent.emit('userChange');
            }
        });

        instance.on('change', () => {
            if (this.parent) {
                this.parent.emit('change');
            }
        });

        return instance;
    }

    isValueChanged (val) {
        return !isEqual(this.get(), val);
    }

    length () {
        return this.all().length;
    }

    map (callback) {
        return this.all().map(callback);
    }

    move (oldIndex, newIndex) {
        let array = this[typedArray].slice(0);
        const item = array[oldIndex];

        array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);

        this.set(array);

        this.emit('userChange');

        return this;
    }

    remove (index) {
        let array = this[typedArray].slice(0);

        array.splice(index, 1);

        this.set(array);

        this.emit('userChange');

        return this;
    }

    removeAll () {
        this.set([]);

        this.emit('userChange');

        return this;
    }

    set (arr) {
        this[typedArray] = arr;
        this.emit('change');
    }

    toJSON () {
        return this.all();
    }

    validate (noRecursion) {
        if (!noRecursion && this[typedArray]) {
            this[typedArray].forEach((arrayItem) => {
                arrayItem.validate();
            });
        }

        if (this.validations) {
            const fieldName = this.validations.field || 'all';

            return validate({
                data: {
                    [ fieldName ]: this.all()
                },
                validations: {
                    [ fieldName ]: this.validations
                }
            });
        }
    }

}

module.exports = ArrayType;
