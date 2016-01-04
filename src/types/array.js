const BaseType = require('./base');

class ArrayType extends BaseType {

    get () {
        const val = super.get();

        return val || [];
    }

    add (item, index) {
        let array = this.get();

        if (typeof index !== 'number') {
            index = array.length;
        }

        array.splice(index, 0, item);

        this.set(array);
    }

    move (oldIndex, newIndex) {
        let array = this.get();
        const item = array[oldIndex];

        array.splice(oldIndex, 1);
        array.splice(newIndex, 0, item);

        this.set(array);
    }

    remove (index) {
        let array = this.get();
        array.splice(index, 1);
        this.set(array);
    }

    removeAll () {
        this.set([]);
    }

}

module.exports = ArrayType;
