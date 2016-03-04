const assert = require('assert');
const Zoo = require('../models/Zoo');

describe('HasMany', () => {

    const zoo = new Zoo();
    const exhibit = zoo.get('exhibits').create();
    const animals = exhibit.get('animals');

    exhibit.apply({
        animalIds: ['1', '2', '3', '4', '5'],
        animals: [{
            id: '1',
            name: 'Scar',
            cubIds: ['2', '3', '4']
        }, {
            id: '2',
            name: 'Kovu'
        }, {
            id: '3',
            name: 'Vitani'
        }, {
            id: '4',
            name: 'Nuka',
            cubIds: ['5', '555', '556']
        }, {
            id: '5',
            name: 'Kiara'
        }]
    });

    it('Should be possible to get the hasMany cubs off of an animal', () => {
        const scar = animals.get('1');

        assert.equal(scar.get('cubs').all().length, 3);
    });

    it('Should be possible to get the hasMany cubs off of an animal by id', () => {
        const scar = animals.get('1');

        assert.equal(scar.get('cubs').get('4').get('name'), 'Nuka');
    });

    it('Should recurse hasMany relationships', () => {
        const scar = animals.get('1');

        assert.equal(scar.get('cubs').get('4').get('cubs').get('5').get('name'), 'Kiara');
    });

    it('Should be possible to add hasMany children', () => {
        const scar = animals.get('1');
        const simba = animals.create();

        simba.apply({
            id: '6',
            name: 'Simba'
        });

        scar.get('cubs').add(simba);

        assert.equal(scar.get('cubs').all().length, 4);
        assert.equal(scar.get('cubs').get('6').get('name'), 'Simba');
    });

    it('Should be possible to move a child', () => {
        const scar = animals.get('1');

        assert.equal(scar.get('cubs').all()[2].get('name'), 'Nuka');
        assert.equal(scar.get('cubs').all()[3].get('name'), 'Simba');

        scar.get('cubs').move(scar.get('cubs').get('6'), 2);

        assert.equal(scar.get('cubs').all()[3].get('name'), 'Nuka');
        assert.equal(scar.get('cubs').all()[2].get('name'), 'Simba');
    });

    it('Should not own models. Models should only live underneath their owner', () => {
        const scar = animals.get('1');
        const simba = animals.get('6');

        simba.set('name', 'Nala');

        assert.equal(simba.get('name'), 'Nala');

        assert.equal(scar.get('cubs').get('6').get('name'), 'Nala');

        scar.get('cubs').get('6').set('name', 'Simba');

        assert.equal(simba.get('name'), 'Simba');
    });

    it('Should be possible to remove hasMany children', () => {
        const scar = animals.get('1');
        const simba = scar.get('cubs').get('6');

        assert.equal(scar.get('cubs').all().length, 4);

        scar.get('cubs').remove(simba);

        assert.equal(scar.get('cubs').all().length, 3);
    });

    it('Should ignore ids that have no model', () => {
        const scar = animals.get('1');
        const nuka = scar.get('cubs').get('4');

        assert.equal(nuka.get('cubs').all().length, 1);
    });

    it('Should return undefined when it is converted to JSON. Everything interesting lives in the map or the model', () => {
        const scar = animals.get('1');

        assert.deepEqual(scar.get('cubs').toJSON(), undefined);
    });

});
