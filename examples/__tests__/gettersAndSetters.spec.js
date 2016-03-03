const assert = require('assert');
const Zoo = require('../models/Zoo');

describe('Getters and Setters', () => {

    it('Should allow us to get and set values on the root Zoo', () => {
        const zoo = new Zoo();

        zoo.set('name', 'The Nashville Zoo');
        zoo.set('isOpen', true);

        assert.equal(zoo.get('name'), 'The Nashville Zoo');
        assert.equal(zoo.get('isOpen'), true);
    });

    it('Should allow us to get the Exhibit ownsMany from within the Zoo', () => {
        const zoo = new Zoo();
        const exhibit = zoo.get('exhibits').create();

        exhibit.set('name', 'Planet of the Apes');

        assert.equal(exhibit.get('name'), 'Planet of the Apes');
    });

    it('Should allow us to get the Animals ownsMany from within the Exhibit', () => {
        const zoo = new Zoo();
        const exhibit = zoo.get('exhibits').create();
        const animal = exhibit.get('animals').create();

        animal.set('name', 'Monkey');
        animal.get('about').set('isTame', true);

        assert.equal(animal.get('name'), 'Monkey');
        assert.equal(animal.get('about').get('isTame'), true);
    });

    it('Should allow us to get and set AnimalType hasOne relationship on Animal', () => {
        const zoo = new Zoo();
        const exhibit = zoo.get('exhibits').create();
        const animal = exhibit.get('animals').create();
        const animalType = animal.get('animalType');

        animalType.set('name', 'Zebra');
        assert.equal(animalType.get('name'), 'Zebra');
    });

    it('Should be possible for an animal to have many cubs', () => {
        const zoo = new Zoo();
        const exhibit = zoo.get('exhibits').create();
        const sarafina = exhibit.get('animals').create();

        const nala = sarafina.get('cubs').create();

        nala.set('name', 'Nala');
        assert.equal(nala.get('name'), 'Nala');
    });

    it('Should be possible to get and set an ownsOne relationship', () => {
        const zoo = new Zoo();
        const zookeeper = zoo.get('zookeeper');

        zookeeper.set('name', 'Zookeeper Sam');

        assert.equal(zookeeper.get('name'), 'Zookeeper Sam');
    });

    it('Should throw an error if you attempt to get a field that does not exist', () => {
        const zoo = new Zoo();

        assert.throws(() => {
            zoo.get('icecream');
        }, Error);
    });

    it('Should throw an error if you attempt to set to a field that does not exist', () => {
        const zoo = new Zoo();

        assert.throws(() => {
            zoo.set('icecream', 'chocolate');
        }, Error);
    });

});
