'use strict';

var registerType = require('../registerType');
var assert = require('assert');

describe('The registerType util', function () {
    describe('When we we register a type', function () {
        it('Should add the type to the Type field on the passed in object', function () {
            var Cannery = {
                isCannery: true,
                Types: {}
            };

            var registered = registerType(Cannery)('FooType', function () {
                return {
                    type: 'foo'
                };
            });

            assert.equal(Cannery.Types.FooType().type, 'foo');
        });

        it('Should return the root Cannery object so we can chain it', function () {
            var Cannery = {
                isCannery: true,
                Types: {}
            };

            var registered = registerType(Cannery)('FooType', function () {
                return {};
            });

            assert.ok(registered.isCannery);
        });
    });
});