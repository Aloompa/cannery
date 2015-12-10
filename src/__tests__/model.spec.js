const rewire = require('rewire');
const assert = require('assert');
const BaseModel = rewire('../model');
let hookSpy = 1;

class DummyRelatedModel extends BaseModel {

    getFields () {
        return {
            id: {},
            name: {}
        };
    }

    static getName () {
        return 'SubDummy';
    }
}

class DummyModel extends BaseModel {

    static getName () {
        return 'Dummy';
    }

    getFields () {
        return {
            id: {
                validation: {
                    required: true
                }
            },
            name: {
                validation: {
                    required: true,
                    string: true
                }
            },
            sub_ids: {},
            sub: this.hasMany(DummyRelatedModel, {
                map: 'sub_ids'
            }),
            politics: {},
            favoriteMovies: this.hasArray({
                name: {}
            }),
            images: this.hasObject({
                original: {},
                eight_five: {}
            }),
            captainHook: {
                hooks: {
                    pull: () => {

                        hookSpy *= 2;
                        return new Promise((resolve, reject) => {
                            resolve(hookSpy);
                        });
                    },

                    pullFilter: (val) => {
                        hookSpy *= 3;
                        return val * 3;
                    },

                    pushFilter: (val) => {
                        hookSpy *= 5;
                        return val * 5;
                    },

                    push: (val) => {
                        hookSpy *= 7;
                        return true;
                    }
                }
            }
        };
    }
}

describe('A Model', () => {
    describe('constructor', () => {
        it('should return an object', () => {
            assert(typeof new DummyModel() === 'object');
        });
    });

    describe('default set/get', () => {
        it('should not allow a field name that is not explicitly set on the model', () => {
            let dm = new DummyModel();

            assert.throws(() => {
                dm.set('age', 30);
            }, Error);
        });

        it('should get what we set', () => {
            let dm = new DummyModel(1);

            dm.set('politics', 'House of Cards');
            assert(dm.get('politics') === 'House of Cards');
        });

        it('should emit a change event when a setter is set', (done) => {
            let dm = new DummyModel({
                id: 1,
                politics: 'Neo-Conservative'
            });

            dm.on('change', () => {
                assert.equal(dm.get('politics'), 'Facist');
                dm.allOff('change');
                done();
            });

            dm.set('politics', 'Facist');
        });

        it('should emit a userChange event when a setter is set', (done) => {
            let dm = new DummyModel(1);

            dm.on('userChange', () => {
                assert.equal(dm.get('politics'), 'Donald Trump');
                dm.allOff('userChange');
                done();
            });

            dm.set('politics', 'Donald Trump');
        });
    });

    describe('off', () => {
        it('should not call removed event listener', (done) => {
            let dm = new DummyModel(1);

            let remove = dm.on('change', () => {
                assert.fail(0, 0, 'Removed listener was called');
            });

            dm.allOff();

            dm.set('politics', 'Just plain angry');

            //Wait a little to make sure its not going to be called.
            setTimeout(done, 50);
        });
    });

    describe('static all()', () => {
        it('Should promise an array of models', () => {
            let request = DummyModel.all();
            request.then((models) => {
                assert(models.isArray());
            });
        });
    });

    describe('static destroy()', () => {
        it('should delete the model', (done) => {
            let request = DummyModel.destroy(new DummyModel(5));

            request.then(() => {
                assert.ok('The destroy method was called');
                done();
            });
        });
    });

    describe('static create()', () => {
        it('should create a model and POST it', (done) => {
            let request = DummyModel.create({
                politics: 'Voluntaryist',
                favoriteColor: 'Yellow'
            });

            request.then((data) => {
                done();
            });
        });
    });

    describe('when we save a model', () => {

        it('should save and return a promise', (done) => {
            let dm = new DummyModel(5);
            dm.set('name', 'John Doe');

            dm.save().then((obj) => {
                done();
            }).catch((e) => {
                done();
            });
        });

        it('should call push and pushFilter on changed fields with those hooks', () => {
            hookSpy = 1;
            let dm = new DummyModel(1);
            dm.set('captainHook', 1);
            dm.save();
            assert(hookSpy % 5 === 0, 'push was not called');
            assert(hookSpy % 7 === 0, 'pushFilter was not called');
        });
    });

    describe('when we have a nested object', () => {
        it('should treat it like a nested model', () => {
            let dm = new DummyModel(1);
            dm.get('images').set('eight_five', 'image.jpg');
            assert.equal(dm.get('images').get('eight_five'), 'image.jpg');
        });
    });

    describe('when we remove an item from an array', () => {
        it('should remove the item', () => {
            let dm = new DummyModel(1);

            dm.add('favoriteMovies', {
                name: 'Fight Club'
            });

            assert.equal(dm.get('favoriteMovies').length, 1);

            dm.remove('favoriteMovies', dm.get('favoriteMovies')[0]);

            assert.equal(dm.get('favoriteMovies').length, 0);
        });
    });

    describe('when we validate a field on the model', () => {
        it('should validate valid things', () => {
            let dm = new DummyModel({
                id: 1
            });

            assert.equal(dm.validate('id'), true);
        });

        it('should fail on invalid things', () => {
            let dm = new DummyModel(1);

            assert.throws(() => {
                dm.validate('name');
            }, Error);
        });
    });

    describe('When we get the data on the model', () => {
        it('Should get the simple types', () => {
            let dm = new DummyModel(1);
            dm.set('name', 'Foobar');
            assert.equal(dm.get('name'), 'Foobar');
        });

        it('Should get objects', () => {
            let dm = new DummyModel({
                images: {
                    original: 'image.bmp',
                    eight_five: 'image.jpg'
                }
            });
            assert.equal(dm.get('images').get('eight_five'), 'image.jpg');
            assert.equal(dm.get('images').get('original'), 'image.bmp');
        });

        it('Should get arrays', () => {
            let dm = new DummyModel(1);
            dm.add('favoriteMovies', {
                name: 'Terminator'
            });
            dm.add('favoriteMovies', {
                name: 'Terminator 2'
            });
            assert.equal(dm.get('favoriteMovies')[0].get('name'), 'Terminator');
            assert.equal(dm.get('favoriteMovies')[1].get('name'), 'Terminator 2');
        });
    });

    describe('When we set the data on the model', () => {
        it('should set the simple types', () => {
            let dm = new DummyModel({
                id: 1,
                name: 'Foobar'
            });
            assert.equal(dm.get('name'), 'Foobar');
        });

        it('should set nested objects types', () => {
            let dm = new DummyModel({
                images: {
                    eight_five: 'image.png'
                }
            });
            assert.equal(dm.get('images').get('eight_five'), 'image.png');
        });

        it('should set nested arrays', () => {
            let dm = new DummyModel({
                favoriteMovies: [{
                    name: 'Ernest Scared Stupid'
                }, {
                    name: 'Ernest Saves Christmas'
                }]
            });
            assert.equal(dm.get('favoriteMovies')[0].get('name'), 'Ernest Scared Stupid');
        });
    });

    describe('When we change a deeply nested property', () => {
        it('Should trigger the subscription on the model', (done) => {
            let dm = new DummyModel({
                images: {
                    eight_five: 'dummy.gif'
                }
            });

            dm.on('change', () => {
                assert.equal(dm.get('images').get('eight_five'), 'dummy.jpg');
                dm.allOff();
                done();
            });

            dm.get('images').set('eight_five', 'dummy.jpg');
        });
    });

});
