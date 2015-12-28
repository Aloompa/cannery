const booleanType = require('../boolean');
const assert = require('assert');

describe('The Boolean type', () => {
    describe('When we create a boolean type', () => {

        it('Should be of a type boolean', () => {
            const field = booleanType();

            assert.equal(field.type, 'boolean');
        });

        it('Should not modify existing booleans', () => {
            const field = booleanType();

            assert.equal(field.hooks.get(true), true);
            assert.equal(field.hooks.get(false), false);
        });

        it('Should convert a string "false" to false', () => {
            const field = booleanType();

            assert.equal(field.hooks.get('false'), false);
        });

        it('Should convert a number 1 to true', () => {
            const field = booleanType();

            assert.equal(field.hooks.get(1), true);
        });

        it('Should convert a number 0 to true', () => {
            const field = booleanType();

            assert.equal(field.hooks.get(0), false);
        });

        it('Should fire additional get hooks after the first one', () => {
            const field = booleanType({
                hooks: {
                    get: (val) => {
                        return !val;
                    }
                }
            });

            assert.equal(field.hooks.get('false'), true);
        });

    });
});
