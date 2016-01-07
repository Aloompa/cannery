'use strict';

const HasMany = require('../hasMany');
const StringType = require('../string');
const NumberType = require('../number');
const ArrayType = require('../array');
const assert = require('assert');
const Model = require('../../model');

class FarmAdapter {

    fetch () {
        return Promise.resolve({
            cowIds: [1, 2, 3]
        });
    }

}

class CowAdapter {

    fetch () {
        return Promise.resolve({
            name: 'Sally',
            id: 1
        });
    }

}

class Cow extends Model {

    getAdapter () {
        return new CowAdapter();
    }

    getFields () {
        return {
            id: NumberType,
            name: StringType
        };
    }

}

class Farm extends Model {

    getAdapter () {
        return new FarmAdapter();
    }

    getFields () {
        const cowIds = new ArrayType(NumberType);

        return {
            cowIds: cowIds,
            cows: new HasMany(Cow, {
                map: cowIds
            })
        };
    }

}

describe('The hasMany type', () => {
    describe('When a model has many of another model', () => {
        it('Should return an array when we get it', () => {
            const farm = new Farm();

            assert.deepEqual(farm.get('cows').all(), []);
        });

        it('Should correctly type a newly added model', () => {
            const farm = new Farm();

            farm.get('cows').add({
                name: 'Betsy'
            });

            assert.equal(farm.get('cows').get(0).get('name'), 'Betsy');
        });

        it('Should update the mapped field to match the hasMany field', () => {
            const farm = new Farm();

            farm.get('cows').add({
                name: 'Betsy',
                id: 22
            });

            farm.get('cows').add({
                name: 'Angus',
                id: 23
            });

            assert.equal(farm.get('cowIds').toJSON()[0], 22);
            assert.equal(farm.get('cowIds').toJSON()[1], 23);
        });

        it('Should not be able to be cast to json', () => {
            const farm = new Farm();

            assert.ok(!farm.get('cows').toJSON());
        });

        it('Should set the parent of nested models to the root model', () => {
            const farm = new Farm(1);

            const parent = farm.get('cows').add({
                name: 'Betsy',
                id: 22
            }).get(0).getParent();

            assert.ok(parent instanceof Farm);
        });

        it('Should perform a findAllWithin call to the adapter to get data', () => {
            
        });

    });
});
