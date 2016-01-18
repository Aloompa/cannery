'use strict';

const Model = require('../model');
const assert = require('assert');
const StringType = require('../types/string');
const ObjectType = require('../types/object');
const NumberType = require('../types/number');

class MockAdapter {

    create (model) {
        let data = model.toJSON();
        data.id = 1;
        return Promise.resolve(data);
    }

    destroy (model) {
        return Promise.resolve(null);
    }

    fetch (model) {
        return Promise.resolve({
            name: 'Edvard Munch',
            id: 3
        });
    }

    findAll (Model, options) {
        return Promise.resolve([{
            name: 'Mark Rothko',
            id: 4
        }, {
            name: 'Francisco Goya',
            id: 5
        }]);
    }

    update (model) {
        return Promise.resolve(model.toJSON());
    }

}

class MockErrorAdapter {

    create () {
        return Promise.reject('Error Message');
    }

    destroy () {
        return Promise.reject('Error Message');
    }

    fetch () {
        return Promise.reject('Error Message');
    }

    update () {
        return Promise.reject('Error Message');
    }

}

class Artist extends Model {

    getAdapter () {
        return new MockAdapter();
    }

    getFields () {
        return {
            name: StringType,
            id: NumberType,
            bio: new ObjectType({
                medium: StringType
            })
        };
    }

}

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

        it('Should catch update errors', (done) => {
            const artist = new Artist(1);

            artist.getAdapter = () => {
                return new MockErrorAdapter();
            };

            artist.save().catch((message) => {
                assert.equal(message, 'Error Message');
                done();
            });
        });

        it('Should reject models with invalid fields', (done) => {

            class FooClass extends Model {

                getFields () {
                    return {
                        name: new StringType({
                            validations: {
                                required: true
                            }
                        })
                    };
                }

            }

            const fooClass = new FooClass();

            fooClass.save().catch((e) => {
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

    describe('When we get the parent model', () => {
        it('Should be null if it is the root model', () => {
            const artist = new Artist();

            assert.equal(artist.getParent(), null);
        });
    });

    describe('When we validate the model', () => {

        it('Should throw an error if there are any invalid fields', () => {
            class MockModel extends Model {
                getFields () {
                    return {
                        name: new StringType({
                            validations: {
                                required: true
                            }
                        })
                    };
                }
            }

            const model = new MockModel();

            assert.throws(() => {
                model.validate();
            }, Error);
        });

        it('Should not throw an error if everything is valid', () => {
            class MockModel extends Model {
                getFields () {
                    return {
                        name: new StringType({
                            validations: {
                                required: true
                            }
                        })
                    };
                }
            }

            const model = new MockModel();

            model.set('name', 'Carrivagio');

            model.validate();
        });

    });

    describe('When we get all of the models', () => {

        it('Should return a promise with all of the instantiated models', (done) => {
            Artist.all().then((artists) => {
                assert.equal(artists[0].get('name'), 'Mark Rothko');
                assert.equal(artists[0].get('id'), 4);
                done();
            });
        });

        it('Should apply events down the tree', (done) => {
            Artist.all().then((artists) => {
                artists.on('change', () => {
                    done();
                });

                artists[0].set('name', 'Raphael');
            });
        });

    });

    describe('When the user changes a field', () => {

        it('Should not be marked as changed initially', () => {
            const artist = new Artist(1);

            assert.ok(!artist.isChanged());
        });

        it('Should set isChanged to return true', () => {
            const artist = new Artist(1);

            artist.set('name', 'Henry Mattise');

            assert.ok(artist.isChanged());
        });

        it('Should go back to being marked as unchanged after a save', (done) => {
            const artist = new Artist(1);

            artist.set('name', 'Henry Mattise');

            artist.save().then(() => {
                assert.ok(!artist.isChanged());
                done();
            });
        });

    });

    describe('When we fetch with a parent', () => {
        it('Should call fetchWithin on the adapter', (done) => {
            const artist = new Artist(1);

            class MyParent {}

            class CustomAdapter {
                fetchWithin (model, parent) {
                    assert.ok(parent instanceof MyParent);
                    assert.ok(model instanceof Artist);

                    return Promise.resolve({});
                }
            }

            artist.getParent = () => {
                return new MyParent();
            };

            artist.getAdapter = () => {
                return new CustomAdapter();
            };

            artist.refresh().then(() => {
                done();
            });
        });
    });
});
