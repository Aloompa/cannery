const BaseType = require('./base');
const ObjectType = require('./object');
const addListenersUtil = require('../util/addListeners');
const fields = Symbol();
const Type = Symbol();
const getTyped = Symbol();
const typeOptions = Symbol();

class ArrayType extends BaseType {

    constructor (ArrayType, arrayFields, options) {
        super();

        this[Type] = ArrayType || BaseType;
        this[fields] = arrayFields;
        this[typeOptions] = options;
    }

    [ getTyped ] () {
        const val = super.get();
        return val || [];
    }

    get (index) {
        const val = this[getTyped]();

        const arr = val.map((item) => {
            if (item instanceof ObjectType) {
                return item;
            }

            return item.get();
        });

        if (typeof index === 'number') {
            return arr[index];
        }

        return arr;
    }

    add (item, index) {
        const typedItem = new this[Type](this[fields], this[typeOptions]);
        let array = this[getTyped]();

        typedItem.apply(item);
        
        addListenersUtil(this, typedItem);

        if (typeof index !== 'number') {
            index = array.length;
        }

        array.splice(index, 0, typedItem);

        this.set(array);

        return this;
    }

    move (oldIndex, newIndex) {
        let array = this[getTyped]();
        const item = array[oldIndex];

        array.splice(oldIndex, 1);
        array.splice(newIndex, 0, item);

        this.set(array);

        return this;
    }

    remove (index) {
        let array = this[getTyped]();
        array.splice(index, 1);
        this.set(array);

        return this;
    }

    removeAll () {
        this.set([]);

        return this;
    }

}

module.exports = ArrayType;
