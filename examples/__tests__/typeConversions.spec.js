const assert = require('assert');
const Zoo = require('../models/Zoo');

describe('Type conversions', () => {
    it('Should convert booleans', () => {
        const zoo = new Zoo();
        const zookeeper = zoo.get('zookeeper');

        zookeeper.set('isGood', 'true');

        assert.equal(zookeeper.get('isGood'), true);
    });

    it('Should convert numbers', () => {
        const zoo = new Zoo();
        const zookeeper = zoo.get('zookeeper');

        zookeeper.set('luckNumber', '43');

        assert.equal(zookeeper.get('luckNumber'), 43);
    });

    it('Should convert strings', () => {
        const zoo = new Zoo();
        const zookeeper = zoo.get('zookeeper');

        zookeeper.set('name', 41);

        assert.equal(zookeeper.get('name'), '41');
    });
});
