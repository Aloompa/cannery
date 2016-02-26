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

});
