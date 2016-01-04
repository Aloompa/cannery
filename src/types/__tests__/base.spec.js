const BaseType = require('../base');
const assert = require('assert');

describe('Any type', () => {
    describe('When we create any type', () => {

        it('Should mirror the passed in options', () => {
            const field = new BaseType({
                foo: 'bar'
            });

            assert.equal(field.foo, 'bar');
        });

        it('Should get and set the same value', () => {
            const field = new BaseType();

            field.set('bar');

            assert.equal(field.get(), 'bar');
        });

        it('Should allow us to extend the get hook', () => {
            const field = new BaseType({
                hooks: {
                    get: (val) => {
                        return `${val}!`;
                    }
                }
            });

            field.set('bar');

            assert.equal(field.get(), 'bar!');
        });

    });
});