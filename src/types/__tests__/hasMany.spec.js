'use strict';

const HasMany = require('../hasMany');
const StringType = require('../string');
const NumberType = require('../number');
const ArrayType = require('../array');
const assert = require('assert');
const Model = require('../../model');

class FarmAdapter {

    fetch () {
        return Promise.resolve({
            cowIds: [1, 2, 3]
        });
    }

}

class CowAdapter {

    findAllWithin (model, Parent) {
        return Promise.resolve([{
            name: 'Sally',
            id: 1
        }, {
            name: 'Bluebell',
            id: 2
        }]);
    }

    fetch () {
        return Promise.resolve({
            name: 'Sally',
            id: 1
        });
    }

}

class Cow extends Model {

    getAdapter () {
        return new CowAdapter();
    }

    getFields () {
        return {
            id: NumberType,
            name: StringType
        };
    }

}

class Farm extends Model {

    getAdapter () {
        return new FarmAdapter();
    }

    getFields () {
        const cowIds = new ArrayType(NumberType);

        return {
            cowIds: cowIds,
            cows: new HasMany(Cow, {
                map: cowIds
            })
        };
    }

}

describe('The hasMany type', () => {
    describe('When a model has many of another model', () => {
        it('Should return an array when we get it', () => {
            const farm = new Farm();

            assert.deepEqual(farm.get('cows').all(), []);
        });

        it('Should correctly type a newly added model', () => {
            const farm = new Farm();

            farm.get('cows').add({
                name: 'Betsy'
            });

            assert.equal(farm.get('cows').get(0).get('name'), 'Betsy');
        });

        it('Should update the mapped field to match the hasMany field', () => {
            const farm = new Farm();

            farm.get('cows').add({
                name: 'Betsy',
                id: 22
            });

            farm.get('cows').add({
                name: 'Angus',
                id: 23
            });

            assert.equal(farm.get('cowIds').toJSON()[0], 22);
            assert.equal(farm.get('cowIds').toJSON()[1], 23);
        });

        it('Should not be able to be cast to json', () => {
            const farm = new Farm();

            assert.ok(!farm.get('cows').toJSON());
        });

        it('Should set the parent of nested models to the root model', () => {
            const farm = new Farm(1);

            const parent = farm.get('cows').add({
                name: 'Betsy',
                id: 22
            }).get(0).getParent();

            assert.ok(parent instanceof Farm);
        });

        it('Should perform a findAllWithin call to the adapter to get data', (done) => {
            const farm = new Farm(1);

            farm.get('cows').on('fetchSuccess', () => {
                assert.equal(farm.get('cows').get(1).get('name'), 'Bluebell');
                done();
            });

            farm.get('cows').all();
        });

        it('Should allow us to reload the data', (done) => {
            const farm = new Farm(1);
            let calledCount = 0;

            farm.get('cows').on('fetchSuccess', () => {

                if (!calledCount) {
                    assert.equal(farm.get('cows').get(0).get('name'), 'Sally');

                    CowAdapter.prototype.findAllWithin = () => {
                        return Promise.resolve([{
                            id: 1,
                            name: 'Bluebell'
                        }]);
                    };

                    farm.get('cows').refresh();

                } else {
                    assert.equal(farm.get('cows').get(0).get('name'), 'Bluebell');
                    done();
                }

                calledCount++;
            });

            farm.get('cows').all();
        });

        it('Should emit an error message if there is an adapter error on findAllWithin', (done) => {
            const farm = new Farm(1);

            CowAdapter.prototype.findAllWithin = () => {
                return Promise.reject('Oops');
            };

            farm.get('cows').on('fetchError', (err) => {
                assert.equal(err, 'Oops');
                done();
            });

            farm.get('cows').all();
        });

    });

    it('Should be possible to createa a hasMany without a mapping', () => {
        class Bar extends Model {
            getFields () {
                return {};
            }
        }

        class Foo extends Model {
            getFields () {
                return {
                    bar: new HasMany(Bar)
                };
            }
        }

        new Foo().get('bar');
    });

    describe('When we get by id', () => {

        class FooAdapter {
            fetch () {
                return Promise.resolve({
                    id: 1,
                    bar_ids: [50]
                });
            }

        }

        class BarAdapter {

            fetchWithin () {
                return Promise.resolve({
                    id: 45
                });
            }

            findAllWithin () {
                return Promise.resolve([{
                    id: 50,
                    name: 'Second Bar'
                }]);
            }

            fetch () {
                return Promise.resolve({
                    id: 1,
                    name: 'First Bar'
                });
            }

        }

        class Bar extends Model {

            getAdapter () {
                return new BarAdapter();
            }

            getFields () {
                return {
                    name: StringType,
                    id: NumberType
                };
            }
        }

        class Foo extends Model {

            getAdapter () {
                return new FooAdapter();
            }

            getFields () {
                const bar_ids = new ArrayType(NumberType);

                return {
                    bar_ids: bar_ids,
                    bar: new HasMany(Bar, {
                        map: bar_ids
                    })
                };
            }
        }

        it('Should return a new instantiated model if it does not exist', () => {
            assert.equal(new Foo().get('bar').getById(1).get('name'), null);
        });

        it('Should return an existing model if it already exists', (done) => {
            const foo = new Foo();

            foo.on('fetchSuccess', () => {
                assert.equal(foo.get('bar').getById(50).get('name'), 'Second Bar');

                done();
            });

            foo.get('bar').all();
        });

    });

    it('Should be possible to call static methods from the hasMany model', () => {
        class Dog {
            static bark (options, loudness) {
                return `BARK${loudness}`;
            }
        }

        const dog = new HasMany(Dog);

        assert.equal(dog.call('bark', '!!!'), 'BARK!!!');
    });

});
