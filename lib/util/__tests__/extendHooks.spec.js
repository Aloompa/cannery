'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var extendHooks = require('../extendHooks');
var assert = require('assert');

describe('The extendHooks util', function () {
    describe('When we extend a hook', function () {
        it('Should call the hooks in the order that they are passed in', function () {
            var hooks = extendHooks({
                get: function get(val) {
                    return parseInt(val, 10);
                }
            }, {
                get: function get(val) {
                    return val * 2;
                }
            });

            assert.equal(hooks.get('2'), 4);
        });

        it('Should call only the first hook if that is the only one', function () {
            var hooks = extendHooks({
                get: function get(val) {
                    return parseInt(val, 10);
                }
            });

            assert.equal(hooks.get('2'), 2);
        });

        it('Should call only the second hook if that is the only one', function () {
            var hooks = extendHooks({}, {
                get: function get(val) {
                    return parseInt(val, 10);
                }
            });

            assert.equal(hooks.get('2'), 2);
        });

        it('Should return an empty object even if no arguments are passed in', function () {
            var hooks = extendHooks();

            assert.ok(typeof hooks === 'undefined' ? 'undefined' : _typeof(hooks), 'object');
        });
    });
});