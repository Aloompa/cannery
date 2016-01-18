'use strict';

var BaseType = require('../base');
var assert = require('assert');

describe('Any type', function () {
    describe('When we create any type', function () {

        it('Should allow us to validate on the field', function () {
            var field = new BaseType({
                validations: {
                    required: true
                }
            });

            assert.throws(function () {
                field.validate('foo');
            }, Error);
        });

        it('Should allow not throw an error on a valid field', function () {
            var field = new BaseType({
                validations: {
                    required: true
                }
            });

            field.set('bar');

            assert.ok(field.validate('foo'));
        });

        it('Should mirror the passed in options', function () {
            var field = new BaseType({
                foo: 'bar'
            });

            assert.equal(field.foo, 'bar');
        });

        it('Should get and set the same value', function () {
            var field = new BaseType();

            field.set('bar');

            assert.equal(field.get(), 'bar');
        });

        it('Should allow us to extend the get hook', function () {
            var field = new BaseType({
                hooks: {
                    get: function get(val) {
                        return val + '!';
                    }
                }
            });

            field.set('bar');

            assert.equal(field.get(), 'bar!');
        });

        it('Should allow us to hook into toJSON', function () {
            var field = new BaseType({
                hooks: {
                    toJSON: function toJSON(val) {
                        return val + '!';
                    }
                }
            });

            field.set('bar');

            assert.equal(field.toJSON(), 'bar!');
        });

        it('Should allow us to hook into apply', function () {
            var field = new BaseType({
                hooks: {
                    apply: function apply(val) {
                        return val + '!';
                    }
                }
            });

            field.apply('bar');

            assert.equal(field.get(), 'bar!');
        });

        it('Should allow us to hook into set', function () {
            var field = new BaseType({
                hooks: {
                    set: function set(val) {
                        return val + '!';
                    }
                }
            });

            field.set('bar');

            assert.equal(field.get(), 'bar!');
        });
    });
});