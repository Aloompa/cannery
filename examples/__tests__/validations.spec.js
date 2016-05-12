const assert = require('assert');
const Zoo = require('../models/Zoo');

describe('Validations', () => {
    it('Should allow us to add validations to fields and validate them', () => {
        const zoo = new Zoo();
        const zookeeper = zoo.get('zookeeper');

        assert.ok(zookeeper.validate('name').getState('saveError'));

        zookeeper.set('name', 'The International Zoo Station');

        assert.ok(!zookeeper.validate('name').getState('saveError'));
    });

    it('Should allow us to validate every field in a model', () => {
        const zoo = new Zoo();
        const zookeeper = zoo.get('zookeeper');

        assert.ok(zookeeper.validate().getState('saveError'));

        zookeeper.set('name', 'The International Zoo Station');

        assert.ok(!zookeeper.validate().getState('saveError'));
    });
});
