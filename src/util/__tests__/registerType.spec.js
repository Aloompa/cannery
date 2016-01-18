'use strict';

const registerType = require('../registerType');
const assert = require('assert');

describe('The registerType util', () => {
    describe('When we we register a type', () => {
        it('Should add the type to the Type field on the passed in object', () => {
            const Cannery = {
                isCannery: true,
                Types: {}
            };

            const registered = registerType(Cannery)('FooType', () => {
                return {
                    type: 'foo'
                };
            });

            assert.equal(Cannery.Types.FooType().type, 'foo');
        });

        it('Should return the root Cannery object so we can chain it', () => {
            const Cannery = {
                isCannery: true,
                Types: {}
            };

            const registered = registerType(Cannery)('FooType', () => {
                return {};
            });

            assert.ok(registered.isCannery);
        });
    });
});
