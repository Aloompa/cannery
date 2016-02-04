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

    fetchWithin () {
        return Promise.resolve({
            name: 'Betsy',
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
            let betsy = new Cow(22);

            betsy.apply({
                id: 22,
                name: 'Betsy'
            });

            farm.get('cows').add(betsy);

            assert.equal(farm.get('cows').get(22).get('name'), 'Betsy');
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
            const betsy = new Cow(22).apply({
                name: 'Betsy',
                id: 22
            });

            const parent = farm.get('cows').add(betsy).get(22).getParent();

            assert.ok(parent instanceof Farm);
        });

        it('Should perform a findAllWithin call to the adapter to get data', (done) => {
            const farm = new Farm(1);

            farm.get('cows').on('fetchSuccess', () => {
                assert.equal(farm.get('cows').get(2).get('name'), 'Bluebell');
                done();
            });

            farm.get('cows').all();
        });

        it('Should allow us to reload the data', (done) => {
            const farm = new Farm(1);
            let calledCount = 0;

            farm.get('cows').on('fetchSuccess', () => {

                if (!calledCount) {
                    assert.equal(farm.get('cows').get(1).get('name'), 'Sally');

                    CowAdapter.prototype.findAllWithin = () => {
                        return Promise.resolve([{
                            id: 1,
                            name: 'Bluebell'
                        }]);
                    };

                    farm.get('cows').refresh();

                } else {
                    assert.equal(farm.get('cows').get(1).get('name'), 'Bluebell');
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
            assert.equal(new Foo().get('bar').get(1).get('name'), null);
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

    it('Should throw an error when you try to set', () => {
        const farm = new Farm();

        assert.throws(() => {
            farm.get('cows').set();
        }, Error);
    });

    it('Should have a forEach convenience function', () => {
        const farm = new Farm();

        farm.get('cows').add(new Cow({
            id: 1,
            name: 'Betsy'
        })).forEach((cow) => {
            assert.equal(cow.get('name'), 'Betsy');
        });
    });

    it('Should have a map convenience function', () => {
        const farm = new Farm();

        farm.get('cows').add(new Cow({
            id: 1,
            name: 'Betsy'
        })).map((cow) => {
            return assert.equal(cow.get('name'), 'Betsy');
        });
    });

    it('Should throw an error if there is not an id in handleResponse()', () => {
        const farm = new Farm();

        assert.throws(() => {
            farm.get('cows').handleResponse({}, [{
                name: 'Betsy'
            }]);
        }, Error);

    });

});
