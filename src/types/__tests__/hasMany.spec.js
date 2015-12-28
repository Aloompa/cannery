const hasMany = require('../hasMany');
const assert = require('assert');

const MyModel = () => {};

MyModel.getName = () => {
    return 'myModel';
};

describe('The hasMany type', () => {

    describe('When we create a hasMany association', () => {

        it('Should have an array type', () => {
            const association = hasMany(MyModel, {});

            assert.equal(association.type, 'array');
        });

        it('Should default to a multiple request type', () => {
            const association = hasMany(MyModel, {});

            assert.equal(association.requestType, 'multiple');
        });

        it('Should allow us to override the request type', () => {
            const association = hasMany(MyModel, {
                requestType: 'single'
            });

            assert.equal(association.requestType, 'single');
        });

        it('Should accept the passed in model and add it to the definition object', () => {
            const association = hasMany(MyModel, {});

            assert.equal(MyModel.getName(), association.model.getName());
        });

        it('Should default the mapping to the model name with _ids', () => {
            const association = hasMany(MyModel, {});

            assert.equal(association.map, 'mymodel_ids');
        });

        it('Should allow us to override the mapping', () => {
            const association = hasMany(MyModel, {
                map: 'foo_mapping'
            });

            assert.equal(association.map, 'foo_mapping');
        });

    });
});
