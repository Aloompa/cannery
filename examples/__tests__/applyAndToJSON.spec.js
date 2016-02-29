const assert = require('assert');
const Zoo = require('../models/Zoo');

/*describe('apply and toJSON', () => {

    it('Should allow us to apply() and toJSON() values on the root Zoo', () => {
        const zoo = new Zoo();

        const data = {
            name: 'The Nashville Zoo',
            isOpen: true,
            id: '2',
            exhibit_ids: [1, 2, 3]
        };

        zoo.apply(data);

        const json = zoo.toJSON();

        assert.deepEqual(json.name, 'The Nashville Zoo');
        assert.deepEqual(json.id, '2');
        assert.deepEqual(json.isOpen, true);
        assert.deepEqual(json.exhibit_ids, [1, 2, 3]);
    });

});
*/
