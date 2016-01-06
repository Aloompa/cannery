'use strict';

const HasOne = require('../hasOne');
const StringType = require('../string');
const NumberType = require('../number');
const assert = require('assert');
const Model = require('../../model');

class FarmerAdapter {

    fetch () {
        return Promise.resolve({
            farmId: 2
        });
    }

}

class FarmAdapter {

    fetch () {
        return Promise.resolve({
            name: 'Farmer Jones',
            id: 1
        });
    }

}

class Farmer extends Model {

    getAdapter () {
        return new FarmerAdapter();
    }

    getFields () {
        return {
            name: StringType
        };
    }

}

class Farm extends Model {

    getAdapter () {
        return new FarmAdapter();
    }

    getFields () {
        const farmerId = new NumberType();

        const farmer = new HasOne(Farmer, {
            map: farmerId
        });

        return {
            farmerId: farmerId,
            farmer: farmer
        };
    }

}

describe('The hasOne type', () => {

    describe('When we create a hasOne association', () => {

        it('Should throw an error if no mapping is specified', () => {
            assert.throws(() => {
                new HasOne(Farmer);
            }, Error);
        });

        it('Should should let us get from the model', () => {
            const farm = new Farm();

            farm.get('farmer').set('name', 'Farmer Jones');

            assert.equal(farm.get('farmer').get('name'), 'Farmer Jones');
        });

        it('Should not let us set directly on the model', () => {
            const farm = new Farm();

            assert.throws(() => {
                farm.set('farmer', 'foo');
            });
        });

        it('Should set the parent so we can traverse back up', () => {
            const farm = new Farm();

            assert.equal(farm.get('farmer').getParent(), farm);
        });

    });

});
