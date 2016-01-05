'use strict';

const HasOne = require('../hasOne');
const assert = require('assert');

class MyModel {

    static getName () {
        return 'myModel';
    }

    getFields () {
        return {};
    }

}

describe('The hasOne type', () => {

    describe('When we create a hasOne association', () => {

        it('Should default the mapping to the model name with _ids', () => {
            const association = new HasOne(MyModel);

            assert.equal(association.map, 'mymodel_ids');
        });

        it('Should allow us to override the mapping', () => {
            const association = new HasOne(MyModel, {
                map: 'foo_mapping'
            });

            assert.equal(association.map, 'foo_mapping');
        });

    });

});
