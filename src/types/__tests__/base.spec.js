const baseType = require('../base');
const assert = require('assert');

describe('Any type', () => {
    describe('When we create any type', () => {

        it('Should mirror the passed in options', () => {
            const field = baseType({
                foo: 'bar'
            });

            assert.equal(field.foo, 'bar');
        });

        it('Should get and set the same value', () => {
            const field = baseType();

            field.hooks.set('bar');

            assert.equal(field.hooks.get(), 'bar');
        });

        it('Should allow us to extend the get hook', () => {
            const field = baseType({
                hooks: {
                    get: (val) => {
                        return `${val}!`;
                    }
                }
            });

            field.hooks.set('bar');

            assert.equal(field.hooks.get(), 'bar!');
        });

    });
});
