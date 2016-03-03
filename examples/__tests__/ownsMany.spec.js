const assert = require('assert');
const Zoo = require('../models/Zoo');

describe('OwnsMay', () => {

    const zoo = new Zoo();
    const exhibit = zoo.get('exhibits').create();
    const animals = exhibit.get('animals');

    exhibit.apply({
        animalIds: ['2', '1', '3'],
        animals: [{
            id: '1',
            name: 'Curious George'
        }, {
            id: '2',
            name: 'King Kong'
        }, {
            id: '3',
            name: 'Donkey Kong'
        }]
    });

    it('Should map the models to the mapped array', () => {
        assert.equal(animals.all().length, 3);

        assert.equal(animals.all()[0].get('name'), 'King Kong');
    });

    it('Should be possible to add a model the ownsMany', () => {
        const diddyKong = animals.create();

        diddyKong.apply({
            id: '4',
            name: 'Diddy Kong'
        });

        animals.add(diddyKong);

        assert.equal(animals.all().length, 4);

        assert.equal(animals.all()[3].get('name'), 'Diddy Kong');
    });

    it('Should be possible to remove a model from the ownsMany', () => {
        animals.remove(animals.all()[3]);

        assert.equal(animals.all().length, 3);
    });

    it('Should be possible to move a model from the ownsMany', () => {
        const curiousGeorge = animals.all()[0];

        assert.equal(animals.all()[0].get('name'), 'King Kong');
        assert.equal(animals.all()[1].get('name'), 'Curious George');
        assert.equal(animals.all()[2].get('name'), 'Donkey Kong');

        animals.move(curiousGeorge, 1);

        assert.equal(animals.all()[0].get('name'), 'Curious George');
        assert.equal(animals.all()[1].get('name'), 'King Kong');
        assert.equal(animals.all()[2].get('name'), 'Donkey Kong');
    });

});
