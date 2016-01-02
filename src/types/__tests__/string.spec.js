const stringType = require('../string');
const assert = require('assert');

describe('The String type', () => {
    describe('When we create a string type', () => {

        it('Should be of a type string', () => {
            const field = stringType();

            assert.equal(field.type, 'string');
        });

        it('Should not alter existing strings', () => {
            const field = stringType();

            field.hooks.set('number 100');

            assert.equal(field.hooks.get(), 'number 100');
        });

        it('Should use a get hook to convert numbers to strings', () => {
            const field = stringType();

            field.hooks.set(100);

            assert.equal(field.hooks.get(), '100');
        });

        it('Should call additional get hooks after string conversion', () => {
            const field = stringType({
                hooks: {
                    get: (val) => {
                        return val + 100;
                    }
                }
            });

            field.hooks.set(100);

            assert.equal(field.hooks.get(), '100100');
        });

    });
});
