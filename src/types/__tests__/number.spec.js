const numberType = require('../number');
const assert = require('assert');

describe('The Number type', () => {
    describe('When we create a number type', () => {

        it('Should be of a type number', () => {
            const field = numberType({});

            assert.equal(field.type, 'number');
        });

        it('Should use a get hook to convert strings to numbers', () => {
            const field = numberType({});

            assert.equal(field.hooks.get('10.5'), 10.5);
        });

        it('Should not modify existing numbers', () => {
            const field = numberType();

            assert.equal(field.hooks.get(10.75), 10.75);
        });

        it('Should return NaN for non-parsable numbers', () => {
            const field = numberType();

            assert.equal(String(field.hooks.get('Hello')), 'NaN');
        });

        it('Should run additional get hooks after the default number get hook', () => {
            const field = numberType({
                hooks: {
                    get: (val) => {
                        return val * 2;
                    }
                }
            });

            assert.equal(field.hooks.get('5'), 10);
        });

    });
});
