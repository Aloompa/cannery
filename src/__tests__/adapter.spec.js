const Adapter = require('../adapter');
const assert = require('assert');

describe('The base adapter', () => {
    describe('When we call the create method', () => {
        it('should return a promise', (done) => {
            const adapter = new Adapter();

            adapter.create({}).then(() => {
                done();
            });
        });
    });

    describe('When we call the destroy method', () => {
        it('should return a promise', (done) => {
            const adapter = new Adapter();

            adapter.destroy(1).then(() => {
                done();
            });
        });
    });

    describe('When we call the findAll method', () => {
        it('should return a promise', (done) => {
            const adapter = new Adapter();

            adapter.findAll().then(() => {
                done();
            });
        });
    });

    describe('When we call the findOne method', () => {
        it('should return a promise', (done) => {
            const adapter = new Adapter();

            adapter.findOne({}).then(() => {
                done();
            });
        });
    });

    describe('When we get the model', () => {
        it('should return the model', () => {
            const adapter = new Adapter('myModel');

            assert.equal(adapter.getModel(), 'myModel');
        });
    });

    describe('When we call the update method', () => {
        it('should return a promise', (done) => {
            const adapter = new Adapter();

            adapter.update(1, {}).then(() => {
                done();
            });
        });
    });
});
