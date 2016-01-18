'use strict';

var DateType = require('../date');
var assert = require('assert');

describe('The Date Type', function () {
    describe('When we apply a date', function () {
        it('Should cast the string to a date', function () {
            var date = new DateType();

            date.apply('06/25/1985');

            assert.ok(date.get() instanceof Date);
            assert.equal(date.get().getMonth(), 5);
            assert.equal(date.get().getDate(), 25);
            assert.equal(date.get().getFullYear(), 1985);
        });
    });

    describe('When we cast the date back to JSON', function () {
        it('Should return a string', function () {
            var date = new DateType();

            date.apply('6/25/1985');

            assert.equal(date.toJSON(), '6/25/1985');
        });
    });
});