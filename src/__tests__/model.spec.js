'use strict';

const Model = require('../model');
const assert = require('assert');
const Artist = require('./mocks/artistModel');
const MockErrorAdapter = require('./mocks/mockErrorAdapter');

describe('The Cannery Base Model', () => {
    describe('When no fields are defined', () => {
        it('Should throw an error', () => {
            assert.throws(() => {
                new Model();
            }, Error);
        });
    });

    describe('When we get the default adapter', () => {
        it('Should return an instantated adapter class', () => {
            class MockModel extends Model {
                getFields () {
                    return {};
                }
            }

            const model = new MockModel();

            assert.equal(typeof model.getAdapter(), 'object');
        });
    });

    describe('When we set a field', () => {
        it('Should allow us to set and get nested string fields', () => {
            const artist = new Artist();

            artist.set('name', 'Salvidor Dali');

            assert.equal(artist.get('name'), 'Salvidor Dali');
        });

        it('Should allow us to set and get nested id fields', () => {
            const artist = new Artist();

            artist.set('id', 1);

            assert.equal(artist.get('id'), 1);
        });

        it('Should fire a change event', (done) => {
            const artist = new Artist();

            artist.on('change', () => {
                done();
            });

            artist.set('name', 'Jackson Pollock');
        });

        it('Should fire a user change event', (done) => {
            const artist = new Artist();

            artist.on('userChange', () => {
                done();
            });

            artist.set('name', 'Piet Mondrian');
        });

        it('Should refresh the model if we get() and nothing is fetched yet', (done) => {
            const artist = new Artist(3);

            artist.on('change', () => {
                assert.equal(artist.get('name'), 'Edvard Munch');
                done();
            });

            artist.get('name');
        });
    });

    describe('When we cast the model to json', () => {
        it('Should return a new json object', () => {
            const artist = new Artist();

            artist.apply({
                name: 'Pablo Picasso',
                id: '4',
                bio: {
                    medium: 'Painting'
                }
            });

            const json = artist.toJSON();

            assert.equal(json.name, 'Pablo Picasso');
            assert.equal(json.id, 4);
            assert.equal(json.bio.medium, 'Painting');
        });
    });

    describe('When we refresh the data on the model', () => {
        it('Should emit a fetching event', (done) => {
            const artist = new Artist();

            artist.on('fetching', () => {
                done();
            });

            artist.refresh();
        });

        it('Should emit a fetch success event', (done) => {
            const artist = new Artist();

            artist.on('fetchSuccess', () => {
                done();
            });

            artist.refresh();
        });

        it('Should emit a fetch error event if there is an error', (done) => {
            const artist = new Artist();

            artist.getAdapter = () => {
                return new MockErrorAdapter();
            };

            artist.on('fetchError', (e) => {
                assert.equal(e, 'Error Message');
                done();
            });

            artist.refresh();
        });
    });

    describe('When we save a model', () => {
        it('Should apply the response data', (done) => {
            const artist = new Artist();

            artist.set('name', 'Andy Warhol');

            artist.save().then((data) => {
                assert.equal(artist.get('id'), 1);
                done();
            });
        });

        it('Should apply the response data for updates', (done) => {
            const artist = new Artist(1);

            artist.set('name', 'Andy Warhol');

            artist.save().then(() => {
                done();
            });
        });

        it('Should catch errors', (done) => {
            const artist = new Artist();

            artist.getAdapter = () => {
                return new MockErrorAdapter();
            };

            artist.save().catch((message) => {
                assert.equal(message, 'Error Message');
                done();
            });
        });
    });

    describe('When we destroy a model', () => {
        it('Should resolve the promise', (done) => {
            const artist = new Artist();

            artist.destroy().then((data) => {
                done();
            });
        });

        it('Should catch errors', (done) => {
            const artist = new Artist();

            artist.getAdapter = () => {
                return new MockErrorAdapter();
            };

            artist.destroy().catch((message) => {
                assert.equal(message, 'Error Message');
                done();
            });
        });
    });
});
