'use strict';

var BooleanType = require('../boolean');
var assert = require('assert');

describe('The Boolean type', function () {
    describe('When we create a boolean type', function () {

        it('Should not modify existing booleans', function () {
            var field = new BooleanType();

            field.set(true);
            assert.equal(field.get(), true);

            field.set(false);
            assert.equal(field.get(), false);
        });

        it('Should convert a string "false" to false', function () {
            var field = new BooleanType();

            field.set('false');

            assert.equal(field.get(), false);
        });

        it('Should convert a number 1 to true', function () {
            var field = new BooleanType();

            field.set(1);

            assert.equal(field.get(), true);
        });

        it('Should convert a number 0 to true', function () {
            var field = new BooleanType();

            field.set(0);

            assert.equal(field.get(), false);
        });

        it('Should fire additional get hooks after the first one', function () {
            var field = new BooleanType({
                hooks: {
                    get: function get(val) {
                        return !val;
                    }
                }
            });

            field.set('false');

            assert.equal(field.get(), true);
        });
    });
});