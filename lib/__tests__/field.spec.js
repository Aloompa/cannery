'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Field = require('../field');
var Model = require('../model');
var assert = require('assert');

var Clue = (function (_Model) {
    _inherits(Clue, _Model);

    function Clue() {
        _classCallCheck(this, Clue);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Clue).apply(this, arguments));
    }

    _createClass(Clue, [{
        key: 'getFields',
        value: function getFields() {
            return {
                name: {},
                description: {}
            };
        }
    }]);

    return Clue;
})(Model);

describe('The object fields tests', function () {
    describe('When we get items in the fields', function () {
        it('Should return the simple value', function () {
            var field = new Field({
                data: {
                    name: 'Sherlock Holmes'
                },
                fields: {
                    name: {}
                }
            });

            assert.equal(field.get('name'), 'Sherlock Holmes');
        });

        it('Should not return a value for an undefined field', function () {
            var field = new Field({
                data: {
                    name: 'Sherlock Holmes'
                },
                fields: {}
            });

            assert.ok(!field.get('name'));
        });
    });

    describe('When we set items on a field', function () {
        it('Should update the value', function () {
            var field = new Field({
                data: {
                    name: 'Sherlock Holmes'
                },
                fields: {
                    name: {}
                }
            });

            field.set('name', 'John Watson');
            assert.equal(field.get('name'), 'John Watson');
        });
    });

    describe('When we get nested items on a field', function () {
        it('Should return the nested item', function () {
            var field = new Field({
                data: {
                    place: {
                        address: {
                            street: '221B Bakers Street'
                        }
                    }
                },
                fields: {
                    place: {
                        type: 'object',
                        fields: {
                            address: {
                                type: 'object',
                                fields: {
                                    street: {}
                                }
                            }
                        }
                    }
                }
            });

            assert.equal(field.get('place').get('address').get('street'), '221B Bakers Street');
        });

        it('Should stub out nested items if the data does not exist yet', function () {
            var field = new Field({
                data: {},
                fields: {
                    place: {
                        type: 'object',
                        fields: {
                            address: {
                                type: 'object',
                                fields: {
                                    street: {}
                                }
                            }
                        }
                    }
                }
            });

            assert.ok(!field.get('place').get('address').get('street'));
        });
    });

    describe('When we set nested items on a field', function () {
        it('Should return the nested item', function () {
            var field = new Field({
                data: {
                    place: {
                        address: {
                            street: '221B Bakers Street'
                        }
                    }
                },
                fields: {
                    place: {
                        type: 'object',
                        fields: {
                            address: {
                                type: 'object',
                                fields: {
                                    street: {}
                                }
                            }
                        }
                    }
                }
            });

            field.get('place').get('address').set('street', '1 Scottland Yard');

            assert.equal(field.get('place').get('address').get('street'), '1 Scottland Yard');
        });
    });

    describe('When we set an array field', function () {
        it('Should throw an error', function () {
            var field = new Field({
                data: {
                    clues: []
                },
                fields: {
                    clues: {
                        type: 'array',
                        fields: {
                            description: {}
                        }
                    }
                }
            });

            assert.throws(function () {
                field.set('clues', [{
                    description: 'The window was broken from the inside'
                }]);
            }, Error);
        });
    });

    describe('When we get an array field', function () {
        it('Should return getters and setters for each row', function () {
            var field = new Field({
                data: {
                    clues: [{
                        description: 'It happened at night'
                    }]
                },
                fields: {
                    clues: {
                        type: 'array',
                        fields: {
                            description: {}
                        }
                    }
                }
            });

            assert.equal(field.get('clues')[0].get('description'), 'It happened at night');
        });

        it('Should default to an empty array if there is no data', function () {
            var field = new Field({
                fields: {
                    clues: {
                        type: 'array',
                        fields: {
                            description: {}
                        }
                    }
                }
            });

            assert.equal(field.get('clues').length, 0);
        });
    });

    describe('When we add to a nested array', function () {
        it('Should add the item to the nested array and provide the getter method', function () {
            var field = new Field({
                data: {
                    clues: []
                },
                fields: {
                    clues: {
                        type: 'array',
                        fields: {
                            description: {},
                            meta: {
                                type: 'object',
                                fields: {
                                    time: {}
                                }
                            }
                        }
                    }
                }
            });

            field.add('clues', {
                description: 'The chicken howls at midnight',
                meta: {
                    time: '2:00'
                }
            });

            assert.equal(field.get('clues')[0].get('description'), 'The chicken howls at midnight');

            field.add('clues', {
                description: 'Dirty fingernails',
                meta: {
                    time: '2:15',
                    important: true
                }
            });

            assert.equal(field.get('clues')[1].get('description'), 'Dirty fingernails');
            assert.equal(field.get('clues')[1].get('meta').get('time'), '2:15');
            assert.ok(!field.get('clues')[1].get('meta').get('important'));
        });
    });

    describe('When we remove from a nested array', function () {
        it('Should remove the item that is passed in', function () {
            var field = new Field({
                data: {
                    clues: [{
                        description: 'It happened at night'
                    }]
                },
                fields: {
                    clues: {
                        type: 'array',
                        fields: {
                            description: {}
                        }
                    }
                }
            });

            assert.ok(field.get('clues').length);
            field.remove('clues', field.get('clues')[0]);
            assert.ok(!field.get('clues').length);
        });
        it('Should throw an error for non-arrays', function () {
            var field = new Field({
                data: {
                    clues: ['It happened at night']
                },
                fields: {
                    clues: {}
                }
            });

            assert.throws(function () {
                field.remove('clues', field.get('clues')[0]);
            }, Error);
        });
    });

    describe('When we get a flat array', function () {
        it('Should return the falst array', function () {
            var field = new Field({
                data: {
                    clue_ids: [22]
                },
                fields: {
                    clue_ids: {
                        type: 'array'
                    }
                }
            });

            assert.equal(field.get('clue_ids')[0], 22);
        });
    });

    describe('When we add to a flat array', function () {
        it('Should add the value to the end of the array', function () {
            var field = new Field({
                data: {
                    clue_ids: [22, 23]
                },
                fields: {
                    clue_ids: {
                        type: 'array'
                    }
                }
            });

            field.add('clue_ids', 24);
            assert.equal(field.get('clue_ids')[2], 24);
        });

        it('Should add the value to the index we provide', function () {
            var field = new Field({
                data: {
                    clue_ids: [22, 23]
                },
                fields: {
                    clue_ids: {
                        type: 'array'
                    }
                }
            });

            field.add('clue_ids', 21, 0);
            assert.equal(field.get('clue_ids')[0], 21);
        });

        it('Should throw an error for non-arrays', function () {
            var field = new Field({
                data: {
                    clues: ['It happened at night']
                },
                fields: {
                    clues: {}
                }
            });

            assert.throws(function () {
                field.add('clues', 'Another clue');
            }, Error);
        });
    });

    describe('When we remove from a flat array', function () {
        it('Should remove the item', function () {
            var field = new Field({
                data: {
                    clue_ids: [22, 23]
                },
                fields: {
                    clue_ids: {
                        type: 'array'
                    }
                }
            });

            assert.ok(field.get('clue_ids').length);
            field.remove('clue_ids', 1);
            field.remove('clue_ids', 0);
            assert.ok(!field.get('clue_ids').length);
        });
    });

    describe('When we listen to a field', function () {
        it('Should trigger the subscription on change', function (done) {
            var field = new Field({
                data: {
                    name: 'Watson'
                },
                fields: {
                    name: {}
                }
            });

            field.on('change', function () {
                assert.equal(field.get('name'), 'Sherlock');
                field.allOff();
                done();
            });

            setTimeout(function () {
                field.set('name', 'Watson');
            }, 100);

            field.set('name', 'Sherlock');
        });

        it('should allow us to mute subscriptions', function (done) {
            var field = new Field({
                data: {
                    name: 'Watson'
                },
                fields: {
                    name: {}
                }
            });

            field.on('change', function () {
                assert.equal(field.get('name'), 'Sherlock');
                field.allOff();
                done();
            });

            field.mute();
            field.set('name', 'Watson');
            field.unmute();
            field.set('name', 'Sherlock');
        });

        it('Should emit up the tree', function (done) {
            var sherlock = new Field({
                data: {
                    friend: {
                        name: 'John'
                    }
                },
                fields: {
                    friend: {
                        type: 'object',
                        fields: {
                            name: {}
                        }
                    }
                }
            });

            var subscription = sherlock.on('change', function () {
                assert.equal(sherlock.get('friend').get('name'), 'J Watson');
                sherlock.allOff();
                done();
            });

            sherlock.get('friend').set('name', 'J Watson');
        });
    });

    describe('When we validate a field', function () {
        it('Should throw an error if the field is invalid', function () {
            var field = new Field({
                data: {
                    name: ''
                },
                fields: {
                    name: {
                        validation: {
                            required: true
                        }
                    }
                }
            });

            assert.throws(function () {
                field.validate('name');
            }, Error);

            field.set('name', 'John');
            field.validate('name');
        });

        it('Should throw an error for a bogus field', function () {
            var field = new Field({
                fields: {}
            });

            assert.throws(function () {
                field.validate('givenName');
            }, Error);
        });

        it('Should validate all the fields if none is specified', function () {
            var field = new Field({
                fields: {
                    id: {},
                    name: {
                        validation: {
                            required: true
                        }
                    }
                }
            });

            assert.throws(function () {
                field.validate();
            }, Error);
        });
    });

    describe('When we get the JSON data for a field', function () {
        it('Should recurse over the object and return just the data', function () {
            var field = new Field({
                data: {
                    name: 'Jim Moriarty'
                },
                fields: {
                    name: {}
                }
            });
            assert.equal(field.toJSON().name, 'Jim Moriarty');
        });

        it('Should handle nested fields', function () {
            var field = new Field({
                data: {
                    friend: {
                        name: 'John'
                    }
                },
                fields: {
                    friend: {
                        type: 'object',
                        fields: {
                            name: {}
                        }
                    }
                }
            });

            assert.equal(field.get('friend').get('name'), 'John');
            assert.equal(field.toJSON().friend.name, 'John');
        });

        it('Should handle nested arrays', function () {
            var field = new Field({
                data: {
                    clue_ids: [10, 11, 12]
                },
                fields: {
                    clue_ids: {
                        type: 'array'
                    }
                }
            });

            assert.equal(field.toJSON().clue_ids[0], 10);
        });
    });

    describe('When we find an array item by ID', function () {
        it('Should return the matching item', function () {
            var arrayField = require('./mocks/field.array.json');
            var field = new Field(arrayField);

            assert.equal(field.findById('clues', 2).get('name'), 'Watson');
        });
    });

    describe('When we remove all items from an array field', function () {
        it('Should clear out the array', function () {
            var arrayField = require('./mocks/field.array.json');
            var field = new Field(arrayField);

            assert.equal(field.get('clues').length, 2);
            field.removeAll('clues');
            assert.equal(field.get('clues').length, 0);
        });
    });

    describe('When we remove an array item by ID', function () {
        it('Should remove the matching item', function () {
            var arrayField = require('./mocks/field.array.json');
            var field = new Field(arrayField);

            field.removeById('clues', 1);

            assert.equal(field.get('clues')[0].get('name'), 'Watson');
        });
    });

    describe('When a field is a nested model', function () {
        it('Should get the related model', function () {
            var field = new Field({
                fields: {
                    clue_ids: {},
                    clues: {
                        map: 'clue_ids',
                        type: 'object',
                        model: Clue
                    }
                }
            });

            field.get('clues').set('name', 'Clue1');

            assert.equal(field.get('clues').get('name'), 'Clue1');
        });

        it('Should trigger userChange events', function (done) {
            var field = new Field({
                fields: {
                    clue_ids: {},
                    clues: {
                        map: 'clue_ids',
                        type: 'object',
                        model: Clue
                    }
                }
            });

            field.on('userChange', function () {
                assert.equal(field.get('clues').get('name'), 'Clue1');
                done();
            });

            field.get('clues').set('name', 'Clue1');
        });
    });

    describe('When we get an array of nested models', function () {
        it('Should return an array', function () {
            var field = new Field({
                fields: {
                    id: {},
                    clue_ids: {
                        type: 'array'
                    },
                    clues: {
                        map: 'clue_ids',
                        type: 'array',
                        model: Clue
                    }
                }
            });

            field.set('id', 1);

            field.add('clues', {
                id: 3,
                name: 'Clue1',
                description: 'Clue1'
            });

            assert.equal(field.get('clues')[0].get('name'), 'Clue1');
        });
    });

    describe('When we save a model', function () {
        it('Should save changed nested models too', function (done) {
            var ImportantClue = (function (_Model2) {
                _inherits(ImportantClue, _Model2);

                function ImportantClue() {
                    _classCallCheck(this, ImportantClue);

                    return _possibleConstructorReturn(this, Object.getPrototypeOf(ImportantClue).apply(this, arguments));
                }

                _createClass(ImportantClue, [{
                    key: 'getFields',
                    value: function getFields() {
                        return {
                            name: {},
                            description: {}
                        };
                    }
                }, {
                    key: 'save',
                    value: function save() {
                        done();
                        return Promise.resolve({});
                    }
                }]);

                return ImportantClue;
            })(Model);

            var field = new Field({
                fields: {
                    clue_ids: {},
                    clue: {
                        map: 'clue_ids',
                        type: 'object',
                        model: ImportantClue
                    }
                }
            });

            field.get('clue').set('name', 'Clue01');

            field.trickleSave();
        });
    });

    describe('When we apply data', function () {
        it('Should use the pullFilter if one is provided', function () {
            var field = new Field({
                data: {
                    name: 'Man in the Yellow Hat'
                },
                fields: {
                    name: {
                        hooks: {
                            pullFilter: function pullFilter(name) {
                                return 'The ' + name;
                            }
                        }
                    }
                }
            });

            assert.equal(field.get('name'), 'The Man in the Yellow Hat');
        });
    });
});