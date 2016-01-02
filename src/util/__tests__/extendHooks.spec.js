const extendHooks = require('../extendHooks');
const assert = require('assert');

describe('The extendHooks util', () => {
    describe('When we extend a hook', () => {
        it('Should call the hooks in the order that they are passed in', () => {
            const hooks = extendHooks({
                get: (val) => {
                    return parseInt(val, 10);
                }
            }, {
                get: (val) => {
                    return val * 2;
                }
            });

            assert.equal(hooks.get('2'), 4);
        });

        it('Should call only the first hook if that is the only one', () => {
            const hooks = extendHooks({
                get: (val) => {
                    return parseInt(val, 10);
                }
            });

            assert.equal(hooks.get('2'), 2);
        });

        it('Should call only the second hook if that is the only one', () => {
            const hooks = extendHooks({
            }, {
                get: (val) => {
                    return parseInt(val, 10);
                }
            });

            assert.equal(hooks.get('2'), 2);
        });

        it('Should return an empty object even if no arguments are passed in', () => {
            const hooks = extendHooks();

            assert.ok(typeof hooks, 'object');
        });

    });
});
