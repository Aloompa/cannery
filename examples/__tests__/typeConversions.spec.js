const assert = require('assert');
const Zoo = require('../models/Zoo');

describe('Type conversions', () => {
    it('Should convert booleans', () => {
        const zoo = new Zoo();
        const zookeeper = zoo.get('zookeeper');

        zookeeper.set('isGood', 'true');

        assert.strictEqual(zookeeper.get('isGood'), true);
    });

    it('Should convert numbers', () => {
        const zoo = new Zoo();
        const zookeeper = zoo.get('zookeeper');

        zookeeper.set('luckyNumber', '43');

        assert.strictEqual(zookeeper.get('luckyNumber'), 43);
    });

    it('Should convert strings', () => {
        const zoo = new Zoo();
        const zookeeper = zoo.get('zookeeper');

        zookeeper.set('name', 41);

        assert.strictEqual(zookeeper.get('name'), '41');
    });
});
