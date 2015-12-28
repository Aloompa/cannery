const anyType = require('../any');
const assert = require('assert');

describe('Any type', () => {
    describe('When we create any type', () => {

        it('Should mirror the passed in options', () => {
            const field = anyType({
                foo: 'bar'
            });

            assert.equal(field.foo, 'bar');
        });

    });
});
