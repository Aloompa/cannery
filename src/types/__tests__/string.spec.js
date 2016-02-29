'use strict';

const StringType = require('../string');
const assert = require('assert');

describe('The String type', () => {
    describe('When we create a string type', () => {

        it('Should not alter existing strings', () => {
            const field = new StringType();

            field.set('number 100');

            assert.equal(field.get(), 'number 100');
        });

        it('Should use a get hook to convert numbers to strings', () => {
            const field = new StringType();

            field.set(100);

            assert.equal(field.get(), '100');
        });

    });
});
