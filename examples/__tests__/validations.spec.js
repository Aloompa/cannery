const assert = require('assert');
const Zoo = require('../models/Zoo');

describe('Validations', () => {
    it('Should allow us to add validations to fields and validate them', () => {
        const zoo = new Zoo();
        const zookeeper = zoo.get('zookeeper');

        assert.throws(() => {
            zookeeper.validate('name');
        }, Error);

        zookeeper.set('name', 'The International Zoo Station');

        zookeeper.validate('name');
    });

    it('Should allow us to validate every field in a model', () => {
        const zoo = new Zoo();
        const zookeeper = zoo.get('zookeeper');

        assert.throws(() => {
            zookeeper.validate();
        }, Error);

        zookeeper.set('name', 'The International Zoo Station');

        zookeeper.validate();
    });
});
