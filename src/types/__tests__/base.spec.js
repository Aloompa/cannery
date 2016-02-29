'use strict';

const BaseType = require('../base');
const assert = require('assert');

describe('Any type', () => {
    describe('When we create any type', () => {

        it('Should allow us to validate on the field', () => {
            const field = new BaseType({
                validations: {
                    required: true
                }
            });

            assert.throws(() => {
                field.validate('foo');
            }, Error);
        });

        it('Should allow not throw an error on a valid field', () => {
            const field = new BaseType({
                validations: {
                    required: true
                }
            });

            field.set('bar');

            assert.ok(field.validate('foo'));
        });

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

    });
});
