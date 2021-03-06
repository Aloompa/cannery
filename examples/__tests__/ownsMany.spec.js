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

    it('Should let us get a model by the id', () => {
        assert.equal(animals.get('1').get('name'), 'Curious George');
    });

    it('Should be possible to search with a query and get back a subset of the models', () => {
        const kongOptions = {
            isKong: true
        };

        animals.apply([
            animals.get('2').toJSON(),
            animals.get('3').toJSON()
        ], kongOptions);

        const theKongs = animals.query(kongOptions);

        assert.equal(theKongs.length, 2);
    });

    it('Should be possible to search with a query and get back a subset of the models part 2', () => {
        const georgeOptions = {
            isGeorge: true
        };

        animals.apply([
            animals.get('1').toJSON()
        ], georgeOptions);

        const george = animals.query(georgeOptions);

        assert.equal(george.length, 1);
    });

    it('Should only hold one instance of each model when we do a query', () => {

        const george = animals.query({
            isGeorge: true
        });

        assert.equal(george[0].get('name'), 'Curious George');
        assert.equal(animals.get('1').get('name'), 'Curious George');

        animals.get('1').set('name', 'Disinterest George');

        assert.equal(animals.get('1').get('name'), 'Disinterest George');
        assert.equal(george[0].get('name'), 'Disinterest George');
    });

    it('Should be possible to have a model in multiple query responses', () => {
        const allMonkeysOptions = {
            allMonkeys: 'very yes'
        };

        animals.apply([
            animals.get('1').toJSON(),
            animals.get('2').toJSON(),
            animals.get('3').toJSON()
        ], allMonkeysOptions);

        const monkeys = animals.query(allMonkeysOptions);

        const george = animals.query({
            isGeorge: true
        });

        assert.equal(monkeys.length, 3);
        assert.equal(george.length, 1);
    });

    it('Should remove the model from the ownsMany() if it is deleted', (done) => {
        const george = animals.get('1');

        assert.equal(animals.all().length, 3);
        assert.equal(animals.toJSON({
            recursive: true
        }).length, 3);

        const onChange = george.on('change', () => {
            assert.equal(animals.toJSON({
                recursive: true
            }).length, 2);
            george.off('change', onChange);
            done();
        });

        george.destroy();
    });

    it('Should add a model to the ownsMany() if it is created', (done) => {
        const louie = animals.create();

        louie.set('name', 'King Louie');

        assert.equal(animals.all().length, 2);

        louie.getAdapter().mockData({
            name: 'King Louie',
            id: '8'
        });

        const onChange = louie.on('change', () => {
            if (!louie.getState('saving')) {
                louie.off('change', onChange);
                assert.equal(animals.all().length, 3);
                assert.equal(animals.get('8').get('name'), 'King Louie');
                done();
            }
        });

        louie.save();
    });

});
