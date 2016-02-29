'use strict';

const BooleanType = require('../boolean');
const assert = require('assert');

describe('The Boolean type', () => {
    describe('When we create a boolean type', () => {

        it('Should not modify existing booleans', () => {
            const field = new BooleanType();

            field.set(true);
            assert.equal(field.get(), true);

            field.set(false);
            assert.equal(field.get(), false);
        });

        it('Should convert a string "false" to false', () => {
            const field = new BooleanType();

            field.set('false');

            assert.equal(field.get(), false);
        });

        it('Should convert a number 1 to true', () => {
            const field = new BooleanType();

            field.set(1);

            assert.equal(field.get(), true);
        });

        it('Should convert a number 0 to true', () => {
            const field = new BooleanType();

            field.set(0);

            assert.equal(field.get(), false);
        });

    });
});
