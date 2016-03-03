const assert = require('assert');
const Zoo = require('../models/Zoo');

describe('model state', () => {

    it('Should be possible to get and set any state on a model', (done) => {
        const zoo = new Zoo();
        const exhibit = zoo.get('exhibits').create();

        const onChange = exhibit.on('change', () => {
            assert.equal(exhibit.getState('foo'), 'bar');
            exhibit.off('change', onChange);
            done();
        });

        exhibit.setState('foo', 'bar');
    });

});
