'use strict';

var NumberType = require('../number');
var assert = require('assert');

describe('The Number type', function () {
    describe('When we create a number type', function () {

        it('Should use a get hook to convert strings to numbers', function () {
            var field = new NumberType({});

            field.set('10.5');

            assert.equal(field.get(), 10.5);
        });

        it('Should not modify existing numbers', function () {
            var field = new NumberType();

            field.set(10.75);

            assert.equal(field.get(), 10.75);
        });

        it('Should return NaN for non-parsable numbers', function () {
            var field = new NumberType();

            field.set('Hello');

            assert.equal(String(field.get()), 'NaN');
        });

        it('Should run additional get hooks after the default number get hook', function () {
            var field = new NumberType({
                hooks: {
                    get: function get(val) {
                        return val * 2;
                    }
                }
            });

            field.set('5');

            assert.equal(field.get(), 10);
        });
    });
});