const arrayType = require('../arrayfrom');
const stringType = require('../string');
const numberType = require('../number');
const assert = require('assert');

describe('The Array type', () => {
    describe('When we create an array', () => {
        it('Should return an object in the correct format', () => {
            const obj = arrayType();

            assert.equal(obj.type, 'arrayfrom');
        });

        it('Should contain the object of types that are passed in', () => {
            const obj = arrayType({
                name: stringType,
                id: numberType
            });

            assert.equal(obj.fields.name.type, 'string');
            assert.equal(obj.fields.id.type, 'number');
        });
    });
});
