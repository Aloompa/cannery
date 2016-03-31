const assert = require('assert');
const Zoo = require('../models/Zoo');

describe('Array Operations', () => {
    it('Should allow us to add an item to an array', () => {
        const zoo = new Zoo();
        const exhibitIds = zoo.get('exhibitIds');

        exhibitIds.add(1);

        assert.equal(exhibitIds.get(0), 1);
    });

    it('Should allow us to add an item to an array at an index specified', () => {
        const zoo = new Zoo();
        const exhibitIds = zoo.get('exhibitIds');

        exhibitIds.add(2);
        exhibitIds.add(1, 0);

        assert.equal(exhibitIds.get(0), 1);
    });

    it('Should allow us to apply data to an array', () => {
        const zoo = new Zoo();
        const exhibitIds = zoo.get('exhibitIds');

        exhibitIds.apply([1, 2, 3]);

        assert.equal(exhibitIds.toJSON()[0], 1);
    });

    it('Should allow us to move items in an array', () => {
        const zoo = new Zoo();
        const exhibitIds = zoo.get('exhibitIds');

        exhibitIds.apply([1, 2, 3]);

        exhibitIds.move(0, 1);

        assert.equal(exhibitIds.all()[0], 2);
    });

    it('Should allow us to remove an item from an array', () => {
        const zoo = new Zoo();
        const exhibitIds = zoo.get('exhibitIds');

        exhibitIds.add(1);

        assert.equal(exhibitIds.length(), 1);

        exhibitIds.remove(0);

        assert.equal(exhibitIds.length(), 0);
    });

    it('Should allow us to remove all items from an array', () => {
        const zoo = new Zoo();
        const exhibitIds = zoo.get('exhibitIds');

        exhibitIds.apply([1, 2, 3]);

        assert.equal(exhibitIds.length(), 3);

        exhibitIds.removeAll();

        assert.equal(exhibitIds.length(), 0);
    });

    it('Should allow us to map over an array', () => {
        const zoo = new Zoo();
        const exhibitIds = zoo.get('exhibitIds');

        exhibitIds.add(1);

        assert.equal(exhibitIds.map((id) => {
            return 'id' + id;
        })[0], 'id1');
    });

    it('Should allow us to call forEach on an array', () => {
        const zoo = new Zoo();
        const exhibitIds = zoo.get('exhibitIds');

        exhibitIds.add(1);

        exhibitIds.forEach((id) => {
            assert.equal(id, 1);
        });
    });
});
