'use strict';

const Cannery = require('../../src/index');
const assert = require('assert');

class LookMaNoFields extends Cannery.Root {}

class BadModel extends Cannery.Model {}

class Root extends Cannery.Root {

    getFields () {
        return {
            badModels: this.define(Cannery.Types.OwnsMany, BadModel)
        }
    }
}

describe('Model Creation', () => {

    it('Should not be possible to create a root without defining fields', () => {

        assert.throws(() => {
            new LookMaNoFields();
        }, Error);

    });

    it('Should not be possible to create a model without defining fields', () => {

        const root = new Root();

        assert.throws(() => {
            root.get('badModels').create();
        }, Error);

    });

    it('Should default the key name', () => {
        assert.equal(BadModel.getKey(), 'BadModels');
        assert.equal(BadModel.getKey(true), 'BadModel');
    });

});
