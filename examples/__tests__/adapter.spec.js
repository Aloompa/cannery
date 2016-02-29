const assert = require('assert');
const Zoo = require('../models/Zoo');

describe('adapter', () => {

    it('Should allow us to apply() and toJSON() values on the root Zoo', (done) => {
        const zoo = new Zoo();

        zoo.on('fetchSuccess', () => {
            done();
        });

        zoo.get('exhibits').all();
    });

});
