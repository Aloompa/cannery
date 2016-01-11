'use strict';

const NumberType = require('../number');
const assert = require('assert');

describe('The Number type', () => {
    describe('When we create a number type', () => {

        it('Should use a get hook to convert strings to numbers', () => {
            const field = new NumberType({});

            field.set('10.5');

            assert.equal(field.get(), 10.5);
        });

        it('Should not modify existing numbers', () => {
            const field = new NumberType();

            field.set(10.75);

            assert.equal(field.get(), 10.75);
        });

        it('Should return NaN for non-parsable numbers', () => {
            const field = new NumberType();

            field.set('Hello');

            assert.equal(String(field.get()), 'NaN');
        });

        it('Should run additional get hooks after the default number get hook', () => {
            const field = new NumberType({
                hooks: {
                    get: (val) => {
                        return val * 2;
                    }
                }
            });

            field.set('5');

            assert.equal(field.get(), 10);
        });

    });
});
