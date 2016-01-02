const objectType = require('../object');
const stringType = require('../string');
const numberType = require('../number');
const assert = require('assert');

describe('The Object type', () => {
    describe('When we create an object type', () => {

        it('Should be of a type object', () => {
            const field = objectType();

            assert.equal(field.type, 'object');
        });

        it('Should contain the object of types that are passed in', () => {
            const field = objectType({
                name: stringType,
                id: numberType
            });

            assert.equal(field.fields.name.type, 'string');
            assert.equal(field.fields.id.type, 'number');
        });

        it('Should allow us to set directly on the object by providing a key as the first argument', () => {
            const field = objectType({
                name: stringType
            });

            field.hooks.set('name', 'Phil');

            assert.equal(field.hooks.get('name'), 'Phil');
        });

        it('Should let us add hooks', () => {
            const field = objectType({
                name: stringType
            }, {
                hooks: {
                    get: (val) => {
                        return `${val}lip`;
                    }
                }
            });

            field.hooks.set('name', 'Phil');

            assert.equal(field.hooks.get('name'), 'Phillip');
        });

        it('Should emit a change event when a field is set', (done) => {
            const field = objectType({
                name: stringType
            });

            field.on('change', () => {
                assert.equal(field.hooks.get('name'), 'Phil');
                done();
            });

            field.hooks.set('name', 'Phil');
        });

    });
});
