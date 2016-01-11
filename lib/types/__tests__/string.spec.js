'use strict';

var StringType = require('../string');
var assert = require('assert');

describe('The String type', function () {
    describe('When we create a string type', function () {

        it('Should not alter existing strings', function () {
            var field = new StringType();

            field.set('number 100');

            assert.equal(field.get(), 'number 100');
        });

        it('Should use a get hook to convert numbers to strings', function () {
            var field = new StringType();

            field.set(100);

            assert.equal(field.get(), '100');
        });

        it('Should call additional get hooks after string conversion', function () {
            var field = new StringType({
                hooks: {
                    get: function get(val) {
                        return val + 100;
                    }
                }
            });

            field.set(100);

            assert.equal(field.get(), '100100');
        });
    });
});