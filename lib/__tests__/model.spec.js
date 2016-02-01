'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Model = require('../model');
var assert = require('assert');
var StringType = require('../types/string');
var ObjectType = require('../types/object');
var NumberType = require('../types/number');
var HasMany = require('../types/hasMany');
var HasOne = require('../types/hasOne');

var MockAdapter = function () {
    function MockAdapter() {
        _classCallCheck(this, MockAdapter);
    }

    _createClass(MockAdapter, [{
        key: 'create',
        value: function create(model) {
            var data = model.toJSON();
            data.id = 1;
            return Promise.resolve(data);
        }
    }, {
        key: 'destroy',
        value: function destroy(model) {
            return Promise.resolve(null);
        }
    }, {
        key: 'fetch',
        value: function fetch(model) {
            return Promise.resolve({
                name: 'Edvard Munch',
                id: 3
            });
        }
    }, {
        key: 'findAll',
        value: function findAll(Model, options) {
            return Promise.resolve([{
                name: 'Mark Rothko',
                id: 4
            }, {
                name: 'Francisco Goya',
                id: 5
            }]);
        }
    }, {
        key: 'update',
        value: function update(model) {
            return Promise.resolve(model.toJSON());
        }
    }]);

    return MockAdapter;
}();

var MockErrorAdapter = function () {
    function MockErrorAdapter() {
        _classCallCheck(this, MockErrorAdapter);
    }

    _createClass(MockErrorAdapter, [{
        key: 'create',
        value: function create() {
            return Promise.reject('Error Message');
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            return Promise.reject('Error Message');
        }
    }, {
        key: 'fetch',
        value: function fetch() {
            return Promise.reject('Error Message');
        }
    }, {
        key: 'update',
        value: function update() {
            return Promise.reject('Error Message');
        }
    }]);

    return MockErrorAdapter;
}();

var Artist = function (_Model) {
    _inherits(Artist, _Model);

    function Artist() {
        _classCallCheck(this, Artist);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Artist).apply(this, arguments));
    }

    _createClass(Artist, [{
        key: 'getAdapter',
        value: function getAdapter() {
            return new MockAdapter();
        }
    }, {
        key: 'getFields',
        value: function getFields() {
            return {
                name: StringType,
                id: NumberType,
                bio: new ObjectType({
                    medium: StringType
                })
            };
        }
    }]);

    return Artist;
}(Model);

describe('The Cannery Base Model', function () {
    describe('When no fields are defined', function () {
        it('Should throw an error', function () {
            assert.throws(function () {
                new Model();
            }, Error);
        });
    });

    describe('When we get the default adapter', function () {
        it('Should return an instantated adapter class', function () {
            var MockModel = function (_Model2) {
                _inherits(MockModel, _Model2);

                function MockModel() {
                    _classCallCheck(this, MockModel);

                    return _possibleConstructorReturn(this, Object.getPrototypeOf(MockModel).apply(this, arguments));
                }

                _createClass(MockModel, [{
                    key: 'getFields',
                    value: function getFields() {
                        return {};
                    }
                }]);

                return MockModel;
            }(Model);

            var model = new MockModel();

            assert.equal(_typeof(model.getAdapter()), 'object');
        });
    });

    describe('When we set a field', function () {
        it('Should allow us to set and get nested string fields', function () {
            var artist = new Artist();

            artist.set('name', 'Salvidor Dali');

            assert.equal(artist.get('name'), 'Salvidor Dali');
        });

        it('Should allow us to set and get nested id fields', function () {
            var artist = new Artist();

            artist.set('id', 1);

            assert.equal(artist.get('id'), 1);
        });

        it('Should fire a change event', function (done) {
            var artist = new Artist();

            artist.on('change', function () {
                done();
            });

            artist.set('name', 'Jackson Pollock');
        });

        it('Should fire a user change event', function (done) {
            var artist = new Artist();

            artist.on('userChange', function () {
                done();
            });

            artist.set('name', 'Piet Mondrian');
        });

        it('Should refresh the model if we get() and nothing is fetched yet', function (done) {
            var artist = new Artist(3);

            artist.on('change', function () {
                assert.equal(artist.get('name'), 'Edvard Munch');
                done();
            });

            artist.get('name');
        });
    });

    describe('When we cast the model to json', function () {
        it('Should return a new json object', function () {
            var artist = new Artist();

            artist.apply({
                name: 'Pablo Picasso',
                id: '4',
                bio: {
                    medium: 'Painting'
                }
            });

            var json = artist.toJSON();

            assert.equal(json.name, 'Pablo Picasso');
            assert.equal(json.id, 4);
            assert.equal(json.bio.medium, 'Painting');
        });
    });

    describe('When we refresh the data on the model', function () {
        it('Should emit a fetching event', function (done) {
            var artist = new Artist();

            artist.on('fetching', function () {
                done();
            });

            artist.refresh();
        });

        it('Should emit a fetch success event', function (done) {
            var artist = new Artist();

            artist.on('fetchSuccess', function () {
                done();
            });

            artist.refresh();
        });

        it('Should emit a fetch error event if there is an error', function (done) {
            var artist = new Artist();

            artist.getAdapter = function () {
                return new MockErrorAdapter();
            };

            artist.on('fetchError', function (e) {
                assert.equal(e, 'Error Message');
                done();
            });

            artist.refresh();
        });
    });

    describe('When we save a model', function () {
        it('Should apply the response data', function (done) {
            var artist = new Artist();

            artist.set('name', 'Andy Warhol');

            artist.save().then(function (data) {
                assert.equal(artist.get('id'), 1);
                done();
            });
        });

        it('Should apply the response data for updates', function (done) {
            var artist = new Artist(1);

            artist.set('name', 'Andy Warhol');

            artist.save().then(function () {
                done();
            });
        });

        it('Should catch errors', function (done) {
            var artist = new Artist();

            artist.getAdapter = function () {
                return new MockErrorAdapter();
            };

            artist.save().catch(function (message) {
                assert.equal(message, 'Error Message');
                done();
            });
        });

        it('Should catch update errors', function (done) {
            var artist = new Artist(1);

            artist.getAdapter = function () {
                return new MockErrorAdapter();
            };

            artist.save().catch(function (message) {
                assert.equal(message, 'Error Message');
                done();
            });
        });

        it('Should reject models with invalid fields', function (done) {
            var FooClass = function (_Model3) {
                _inherits(FooClass, _Model3);

                function FooClass() {
                    _classCallCheck(this, FooClass);

                    return _possibleConstructorReturn(this, Object.getPrototypeOf(FooClass).apply(this, arguments));
                }

                _createClass(FooClass, [{
                    key: 'getFields',
                    value: function getFields() {
                        return {
                            name: new StringType({
                                validations: {
                                    required: true
                                }
                            })
                        };
                    }
                }]);

                return FooClass;
            }(Model);

            var fooClass = new FooClass();

            fooClass.save().catch(function (e) {
                done();
            });
        });
    });

    describe('When we destroy a model', function () {
        it('Should resolve the promise', function (done) {
            var artist = new Artist();

            artist.destroy().then(function (data) {
                done();
            });
        });

        it('Should catch errors', function (done) {
            var artist = new Artist();

            artist.getAdapter = function () {
                return new MockErrorAdapter();
            };

            artist.destroy().catch(function (message) {
                assert.equal(message, 'Error Message');
                done();
            });
        });
    });

    describe('When we get the parent model', function () {
        it('Should be null if it is the root model', function () {
            var artist = new Artist();

            assert.equal(artist.getParent(), null);
        });
    });

    describe('When we validate the model', function () {

        it('Should throw an error if there are any invalid fields', function () {
            var MockModel = function (_Model4) {
                _inherits(MockModel, _Model4);

                function MockModel() {
                    _classCallCheck(this, MockModel);

                    return _possibleConstructorReturn(this, Object.getPrototypeOf(MockModel).apply(this, arguments));
                }

                _createClass(MockModel, [{
                    key: 'getFields',
                    value: function getFields() {
                        return {
                            name: new StringType({
                                validations: {
                                    required: true
                                }
                            })
                        };
                    }
                }]);

                return MockModel;
            }(Model);

            var model = new MockModel();

            assert.throws(function () {
                model.validate();
            }, Error);
        });

        it('Should not throw an error if everything is valid', function () {
            var MockModel = function (_Model5) {
                _inherits(MockModel, _Model5);

                function MockModel() {
                    _classCallCheck(this, MockModel);

                    return _possibleConstructorReturn(this, Object.getPrototypeOf(MockModel).apply(this, arguments));
                }

                _createClass(MockModel, [{
                    key: 'getFields',
                    value: function getFields() {
                        return {
                            name: new StringType({
                                validations: {
                                    required: true
                                }
                            })
                        };
                    }
                }]);

                return MockModel;
            }(Model);

            var model = new MockModel();

            model.set('name', 'Carrivagio');

            model.validate();
        });
    });

    describe('When we get all of the models', function () {

        it('Should return a promise with all of the instantiated models', function (done) {
            Artist.all().then(function (artists) {
                assert.equal(artists[0].get('name'), 'Mark Rothko');
                assert.equal(artists[0].get('id'), 4);
                done();
            });
        });

        it('Should apply events down the tree', function (done) {
            Artist.all().then(function (artists) {
                artists.on('change', function () {
                    done();
                });

                artists[0].set('name', 'Raphael');
            });
        });
    });

    describe('When the user changes a field', function () {

        it('Should not be marked as changed initially', function () {
            var artist = new Artist(1);

            assert.ok(!artist.isChanged());
        });

        it('Should set isChanged to return true', function () {
            var artist = new Artist(1);

            artist.set('name', 'Henry Mattise');

            assert.ok(artist.isChanged());
        });

        it('Should go back to being marked as unchanged after a save', function (done) {
            var artist = new Artist(1);

            artist.set('name', 'Henry Mattise');

            artist.save().then(function () {
                assert.ok(!artist.isChanged());
                done();
            });
        });
    });

    describe('When we fetch with a parent', function () {
        it('Should call fetchWithin on the adapter', function (done) {
            var artist = new Artist(1);

            var MyParent = function MyParent() {
                _classCallCheck(this, MyParent);
            };

            var CustomAdapter = function () {
                function CustomAdapter() {
                    _classCallCheck(this, CustomAdapter);
                }

                _createClass(CustomAdapter, [{
                    key: 'fetchWithin',
                    value: function fetchWithin(model, parent) {
                        assert.ok(parent instanceof MyParent);
                        assert.ok(model instanceof Artist);

                        return Promise.resolve({});
                    }
                }]);

                return CustomAdapter;
            }();

            artist.getParent = function () {
                return new MyParent();
            };

            artist.getAdapter = function () {
                return new CustomAdapter();
            };

            artist.refresh().then(function () {
                done();
            });
        });
    });

    describe('Deeply nested events', function () {
        var MockAdapter2 = function () {
            function MockAdapter2() {
                _classCallCheck(this, MockAdapter2);
            }

            _createClass(MockAdapter2, [{
                key: 'fetch',
                value: function fetch() {
                    return Promise.resolve({});
                }
            }, {
                key: 'findAllWithin',
                value: function findAllWithin() {
                    return Promise.resolve([]);
                }
            }]);

            return MockAdapter2;
        }();

        var ChildModel = function (_Model6) {
            _inherits(ChildModel, _Model6);

            function ChildModel() {
                _classCallCheck(this, ChildModel);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(ChildModel).apply(this, arguments));
            }

            _createClass(ChildModel, [{
                key: 'getAdapter',
                value: function getAdapter() {
                    return new MockAdapter2(this);
                }
            }, {
                key: 'getFields',
                value: function getFields() {
                    return {
                        id: NumberType,
                        name: StringType
                    };
                }
            }]);

            return ChildModel;
        }(Model);

        var ParentModel = function (_Model7) {
            _inherits(ParentModel, _Model7);

            function ParentModel() {
                _classCallCheck(this, ParentModel);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(ParentModel).apply(this, arguments));
            }

            _createClass(ParentModel, [{
                key: 'getAdapter',
                value: function getAdapter() {
                    return new MockAdapter2(this);
                }
            }, {
                key: 'getFields',
                value: function getFields() {
                    return {
                        children: new HasMany(ChildModel)
                    };
                }
            }]);

            return ParentModel;
        }(Model);

        var RootModel = function (_Model8) {
            _inherits(RootModel, _Model8);

            function RootModel() {
                _classCallCheck(this, RootModel);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(RootModel).apply(this, arguments));
            }

            _createClass(RootModel, [{
                key: 'getAdapter',
                value: function getAdapter() {
                    return new MockAdapter2(this);
                }
            }, {
                key: 'getFields',
                value: function getFields() {
                    return {
                        parent: new HasOne(ParentModel)
                    };
                }
            }]);

            return RootModel;
        }(Model);

        it('Should trigger change events from hasMany models', function (done) {

            var parent = new ParentModel(2);

            parent.get('children').add({
                id: 1,
                name: 'Child1'
            });

            var child = parent.get('children').get(0);

            var isDone = false;

            parent.on('change', function () {
                if (!isDone && child.get('name') === 'Child2') {
                    isDone = true;
                    done();
                }
            });

            child.set('name', 'Child2');
        });

        it('Should trigger change event from hasMany models to hasOne models to the parent', function (done) {
            var root = new RootModel();

            root.get('parent').get('children').add({
                id: 3,
                name: 'Child3'
            });

            var child = root.get('parent').get('children').get(0);

            var isDone = false;

            root.on('change', function () {
                if (!isDone && child.get('name') === 'Child4') {
                    isDone = true;
                    done();
                }
            });

            child.set('name', 'Child4');
        });

        it('Should trigger userChange event from hasMany models to hasOne models to the parent', function (done) {
            var root = new RootModel();

            root.get('parent').get('children').add({
                id: 3,
                name: 'Child3'
            });

            var child = root.get('parent').get('children').get(0);

            var isDone = false;

            root.on('userChange', function () {
                if (!isDone && child.get('name') === 'Child4') {
                    isDone = true;
                    done();
                }
            });

            child.set('name', 'Child4');
        });
    });
});