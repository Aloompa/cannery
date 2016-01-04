const ArrayType = require('../array');
const assert = require('assert');

describe('The Flat Array type', () => {
    describe('When we create an array', () => {

        it('Should allow us to add to the array', () => {
            const arr = new ArrayType();

            arr.add(1);
            arr.add(2);

            assert.equal(arr.get()[0], 1);
            assert.equal(arr.get()[1], 2);
        });

        it('Should allow us to add to the array at a certain index', () => {
            const arr = new ArrayType();

            arr.add(1);
            arr.add(2, 0);

            assert.equal(arr.get()[1], 1);
            assert.equal(arr.get()[0], 2);
        });

        it('Should allow us to move an item from one point to another in the array', () => {
            const arr = new ArrayType();

            arr.add(1);
            arr.add(2);

            arr.move(0, 1);

            assert.equal(arr.get()[0], 2);
            assert.equal(arr.get()[1], 1);
        });

        it('Should allow us to remove an item from the array', () => {
            const arr = new ArrayType();

            arr.add(1);
            arr.remove(0);

            assert.ok(!arr.get()[0]);
        });

        it('Should allow us to remove all the items from an array', () => {
            const arr = new ArrayType();

            arr.add(1);
            arr.add(2);

            assert.equal(arr.get().length, 2);

            arr.removeAll();

            assert.equal(arr.get().length, 0);
        });
    });
});
