'use strict';

const ArrayType = require('../array');
const ObjectType = require('../object');
const NumberType = require('../number');
const StringType = require('../string');
const Model = require('../../model');
const assert = require('assert');

class Farmer extends Model {

    getFields () {
        return {
            chickens: new ArrayType(StringType)
        };
    }

}

describe('The Array type', () => {

    it('Should allow us to add to the array', () => {
        const arr = new ArrayType(NumberType);

        arr.add(1);
        arr.add(2);

        assert.equal(arr.get(0), 1);
        assert.equal(arr.get(1), 2);
    });

    it('Should allow us to add to the array at a certain index', () => {
        const arr = new ArrayType(NumberType);

        arr.add(1);
        arr.add(2, 0);

        assert.equal(arr.get(1), 1);
        assert.equal(arr.get(0), 2);
    });

    it('Should allow us to move an item from one point to another in the array', () => {
        const arr = new ArrayType(NumberType);

        arr.add(1);
        arr.add(2);

        arr.move(0, 1);

        assert.equal(arr.get(0), 2);
        assert.equal(arr.get(1), 1);
    });

    it('Should allow us to remove an item from the array', () => {
        const arr = new ArrayType(NumberType);

        arr.add(1);
        arr.remove(0);

        assert.ok(!arr.get(0));
    });

    it('Should allow us to remove all the items from an array', () => {
        const arr = new ArrayType(NumberType);

        arr.add(1);
        arr.add(2);

        assert.equal(arr.length(), 2);

        arr.removeAll();

        assert.equal(arr.length(), 0);
    });

    it('Should enforce typing on array items', () => {
        const arr = new ArrayType(StringType);

        arr.add(1);

        assert.equal(arr.get(0), '1');
    });

    it('Should use the base type if no type is passed in', () => {
        const arr = new ArrayType();

        arr.add({
            foo: 'bar'
        });

        assert.equal(arr.get(0).foo, 'bar');
    });

    it('Should return the array when we get an array type from a model', () => {
        const farmer = new Farmer();

        farmer.get('chickens').add('Wilma');

        assert.equal(farmer.get('chickens').length(), 1);
        assert.equal(farmer.get('chickens').get(0), 'Wilma');

    });

    it('Should provide a forEach shortcut', () => {
        const farmer = new Farmer();

        farmer.get('chickens').add('Cathy').forEach((chicken) => {
            assert.equal(chicken, 'Cathy');
        });
    });

    it('Should provide a map shortcut', () => {
        const farmer = new Farmer();

        const chickens = farmer.get('chickens').add('Philus').map((chicken) => {
            return `Mrs ${chicken}`;
        });

        assert.equal(chickens[0], 'Mrs Philus');
    });

    it('Should call the toJSON methods nested down the chain', () => {
        const farmer = new Farmer();

        const chickens = farmer.get('chickens').add('Philus').toJSON();

        assert.equal(chickens[0], 'Philus');
    });

    it('Should be able to return the type', () => {
        const farmer = new Farmer();

        assert.equal(farmer.get('chickens').getType().name, 'StringType');
    });
});
