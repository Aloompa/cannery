const assert = require('assert');
const Zoo = require('../models/Zoo');

describe('apply and toJSON', () => {

    it('Should allow us to apply() and toJSON() values on the root Zoo', () => {
        const zoo = new Zoo();

        const data = {
            name: 'The Nashville Zoo',
            isOpen: true,
            id: '2',
            exhibitIds: [1, 2, 3]
        };

        zoo.apply(data);

        const json = zoo.toJSON();

        assert.deepEqual(json.name, 'The Nashville Zoo');
        assert.deepEqual(json.id, '2');
        assert.deepEqual(json.isOpen, true);
        assert.deepEqual(json.exhibitIds, [1, 2, 3]);
    });

    it('Should allow us to apply() and toJSON() values on a child Exhibit', () => {
        const zoo = new Zoo();
        const wrathOfTheSnails = zoo.get('exhibits').create();

        wrathOfTheSnails.apply({
            name: 'Wrath of the Snails'
        });

        assert.equal(wrathOfTheSnails.toJSON().name, 'Wrath of the Snails');
    });

    it('Should allow us to cast numbers to strings when we apply them', () => {
        const zoo = new Zoo();
        const wrathOfTheSnails = zoo.get('exhibits').create();

        wrathOfTheSnails.apply({
            id: 1
        });

        assert.equal(typeof wrathOfTheSnails.toJSON().id, 'string');
    });

    it('Should allow us to apply and toJSON the entire tree', () => {
        const zoo = new Zoo();

        const data = {
            id: '1',
            name: 'The Nashville Zoo',
            isOpen: true,
            exhibitIds: [1, 2],
            exhibits: [{
                id: '1',
                name: 'Lion Around',
                animals: [{
                    id: '1',
                    name: 'Simba',
                    about: {
                        isTame: false
                    },
                    animalType: {
                        id: '1',
                        name: 'Lion'
                    }
                }, {
                    id: '2',
                    name: 'Aslan',
                    about: {
                        isTame: false
                    },
                    animalType: {
                        id: '1',
                        name: 'Lion'
                    }
                }]
            }, {
                id: '2',
                name: 'Get Otter Here',
                animals: [{
                    id: '3',
                    name: 'Emmit',
                    about: {
                        isTame: true
                    },
                    animalType: {
                        id: '2',
                        name: 'Otter'
                    }
                }]
            }]
        };

        zoo.apply(data);

        assert.deepEqual(zoo.toJSON({
            recursive: true
        }), data);

    });

    it('Should make any id that is supplied in response to a POST be the id of the model', () => {
        const zoo = new Zoo();
        const exhibit = zoo.get('exhibits').create();

        exhibit.apply({
            id: '3',
            name: 'Monkey Business'
        });

        assert.equal(exhibit.id, '3');
    });

    it('Should be possible to convert any model to json', () => {
        const zoo = new Zoo();
        const exhibit = zoo.get('exhibits').create();

        exhibit.apply({
            name: 'Monkey Business'
        });

        assert.equal(exhibit.toJSON().name, 'Monkey Business');
    });

    it('Should never overwrite an existing model id. This is folly', () => {
        const zoo = new Zoo();
        const exhibit = zoo.get('exhibits').create();

        exhibit.apply({
            id: '4'
        }).apply({
            id: '5'
        });

        assert.equal(exhibit.id, '4');
    });

});
