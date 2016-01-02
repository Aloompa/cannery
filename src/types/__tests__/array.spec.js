const arrayType = require('../array');
const assert = require('assert');

describe('The Flat Array type', () => {
    describe('When we create an array', () => {
        it('Should return an array in the correct format', () => {
            const arr = arrayType();

            assert.equal(arr.type, 'array');
        });

        it('Should allow us to add to the array', () => {
            const arr = arrayType();

            arr.hooks.add(1);
            arr.hooks.add(2);

            assert.equal(arr.hooks.get()[0], 1);
            assert.equal(arr.hooks.get()[1], 2);
        });

        it('Should allow us to add to the array at a certain index', () => {
            const arr = arrayType();

            arr.hooks.add(1);
            arr.hooks.add(2, 0);

            assert.equal(arr.hooks.get()[1], 1);
            assert.equal(arr.hooks.get()[0], 2);
        });

        it('Should allow us to move an item from one point to another in the array', () => {
            const arr = arrayType();

            arr.hooks.add(1);
            arr.hooks.add(2);

            arr.hooks.move(0, 1);

            assert.equal(arr.hooks.get()[0], 2);
            assert.equal(arr.hooks.get()[1], 1);
        });

        it('Should allow us to remove an item from the array', () => {
            const arr = arrayType();

            arr.hooks.add(1);
            arr.hooks.remove(0);

            assert.ok(!arr.hooks.get()[0]);
        });

        it('Should allow us to remove all the items from an array', () => {
            const arr = arrayType();

            arr.hooks.add(1);
            arr.hooks.add(2);

            assert.equal(arr.hooks.get().length, 2);

            arr.hooks.removeAll();

            assert.equal(arr.hooks.get().length, 0);
        });
    });
});
