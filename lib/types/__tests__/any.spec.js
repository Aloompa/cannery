'use strict';

var anyType = require('../any');
var assert = require('assert');

describe('Any type', function () {
    describe('When we create any type', function () {

        it('Should mirror the passed in options', function () {
            var field = anyType({
                foo: 'bar'
            });

            assert.equal(field.foo, 'bar');
        });
    });
});