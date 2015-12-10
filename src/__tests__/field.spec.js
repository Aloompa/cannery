const Field      = require('../field');
const Model      = require('../model');
const assert     = require('assert');

class Clue extends Model {

    getFields () {
        return {
            name: {},
            description: {}
        };
    }

}

describe('The object fields tests', () => {
    describe('When we get items in the fields', () => {
        it('Should return the simple value', () => {
            let field = new Field({
                data: {
                    name: 'Sherlock Holmes'
                },
                fields: {
                    name: {}
                }
            });

            assert.equal(field.get('name'), 'Sherlock Holmes');
        });

        it('Should not return a value for an undefined field', () => {
            let field = new Field({
                data: {
                    name: 'Sherlock Holmes'
                },
                fields: {}
            });

            assert.ok(!field.get('name'));
        });
    });

    describe('When we set items on a field', () => {
        it('Should update the value', () => {
            let field = new Field({
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

    describe('When we get nested items on a field', () => {
        it('Should return the nested item', () => {
            let field = new Field({
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

        it('Should stub out nested items if the data does not exist yet', () => {
            let field = new Field({
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

    describe('When we set nested items on a field', () => {
        it('Should return the nested item', () => {
            let field = new Field({
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

    describe('When we set an array field', () => {
        it('Should throw an error', () => {
            let field = new Field({
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

            assert.throws(() => {
                field.set('clues', [{
                    description: 'The window was broken from the inside'
                }]);
            }, Error);
        });
    });

    describe('When we get an array field', () => {
        it('Should return getters and setters for each row', () => {
            let field = new Field({
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

        it('Should default to an empty array if there is no data', () => {
            let field = new Field({
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

    describe('When we add to a nested array', () => {
        it('Should add the item to the nested array and provide the getter method', () => {
            let field = new Field({
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

    describe('When we remove from a nested array', () => {
        it('Should remove the item that is passed in', () => {
            let field = new Field({
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
        it('Should throw an error for non-arrays', () => {
            let field = new Field({
                data: {
                    clues: ['It happened at night']
                },
                fields: {
                    clues: {}
                }
            });

            assert.throws(() => {
                field.remove('clues', field.get('clues')[0]);
            }, Error);
        });
    });

    describe('When we get a flat array', () => {
        it('Should return the falst array', () => {
            let field = new Field({
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

    describe('When we add to a flat array', () => {
        it('Should add the value to the end of the array', () => {
            let field = new Field({
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

        it('Should add the value to the index we provide', () => {
            let field = new Field({
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

        it('Should throw an error for non-arrays', () => {
            let field = new Field({
                data: {
                    clues: ['It happened at night']
                },
                fields: {
                    clues: {}
                }
            });

            assert.throws(() => {
                field.add('clues', 'Another clue');
            }, Error);
        });
    });

    describe('When we remove from a flat array', () => {
        it('Should remove the item', () => {
            let field = new Field({
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

    describe('When we listen to a field', () => {
        it('Should trigger the subscription on change', (done) => {
            let field = new Field({
                data: {
                    name: 'Watson'
                },
                fields: {
                    name: {}
                }
            });

            field.on('change', () => {
                assert.equal(field.get('name'), 'Sherlock');
                field.allOff();
                done();
            });

            setTimeout(() => {
                field.set('name', 'Watson');
            }, 100);

            field.set('name', 'Sherlock');
        });

        it('should allow us to mute subscriptions', (done) => {
            let field = new Field({
                data: {
                    name: 'Watson'
                },
                fields: {
                    name: {}
                }
            });

            field.on('change', () => {
                assert.equal(field.get('name'), 'Sherlock');
                field.allOff();
                done();
            });

            field.mute();
            field.set('name', 'Watson');
            field.unmute();
            field.set('name', 'Sherlock');
        });

        it('Should emit up the tree', (done) => {
            let sherlock = new Field({
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

            let subscription = sherlock.on('change', () => {
                assert.equal(sherlock.get('friend').get('name'), 'J Watson');
                sherlock.allOff();
                done();
            });

            sherlock.get('friend').set('name', 'J Watson');
        });
    });

    describe('When we validate a field', () => {
        it('Should throw an error if the field is invalid', () => {
            let field = new Field({
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

            assert.throws(() => {
                field.validate('name');
            }, Error);

            field.set('name', 'John');
            field.validate('name');
        });

        it('Should throw an error for a bogus field', () => {
            let field = new Field({
                fields: {}
            });

            assert.throws(() => {
                field.validate('givenName');
            }, Error);
        });

        it('Should validate all the fields if none is specified', () => {
            let field = new Field({
                fields: {
                    id: {},
                    name: {
                        validation: {
                            required: true
                        }
                    }
                }
            });

            assert.throws(() => {
                field.validate();
            }, Error);
        });
    });

    describe('When we get the JSON data for a field', () => {
        it('Should recurse over the object and return just the data', () => {
            let field = new Field({
                data: {
                    name: 'Jim Moriarty'
                },
                fields: {
                    name: {}
                }
            });
            assert.equal(field.toJSON().name, 'Jim Moriarty');
        });

        it('Should handle nested fields', () => {
            let field = new Field({
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

        it('Should handle nested arrays', () => {
            let field = new Field({
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

    describe('When we find an array item by ID', () => {
        it('Should return the matching item', () => {
            const arrayField = require('./mocks/field.array.json');
            let field = new Field(arrayField);

            assert.equal(field.findById('clues', 2).get('name'), 'Watson');
        });
    });

    describe('When we remove all items from an array field', () => {
        it('Should clear out the array', () => {
            const arrayField = require('./mocks/field.array.json');
            let field = new Field(arrayField);

            assert.equal(field.get('clues').length, 2);
            field.removeAll('clues');
            assert.equal(field.get('clues').length, 0);
        });
    });

    describe('When we remove an array item by ID', () => {
        it('Should remove the matching item', () => {
            const arrayField = require('./mocks/field.array.json');
            let field = new Field(arrayField);

            field.removeById('clues', 1);

            assert.equal(field.get('clues')[0].get('name'), 'Watson');
        });
    });

    describe('When a field is a nested model', () => {
        it ('Should get the related model', () => {
            let field = new Field({
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

        it ('Should trigger userChange events', (done) => {
            let field = new Field({
                fields: {
                    clue_ids: {},
                    clues: {
                        map: 'clue_ids',
                        type: 'object',
                        model: Clue
                    }
                }
            });

            field.on('userChange', () => {
                assert.equal(field.get('clues').get('name'), 'Clue1');
                done();
            });

            field.get('clues').set('name', 'Clue1');
        });

    });

    describe('When we get an array of nested models', () => {
        it('Should return an array', () => {
            let field = new Field({
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

    describe('When we save a model', () => {
        it('Should save changed nested models too', (done) => {

            class ImportantClue extends Model {

                getFields () {
                    return {
                        name: {},
                        description: {}
                    };
                }

                save () {
                    done();
                    return Promise.resolve({});
                }

            }

            let field = new Field({
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

    describe('When we apply data', () => {
        it('Should use the pullFilter if one is provided', () => {
            let field = new Field({
                data: {
                    name: 'Man in the Yellow Hat'
                },
                fields: {
                    name: {
                        hooks: {
                            pullFilter: (name) => {
                                return `The ${name}`;
                            }
                        }
                    }
                }
            });

            assert.equal(field.get('name'), 'The Man in the Yellow Hat');
        });
    });

});
