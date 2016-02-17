import Cannery from '../index';
import assert from 'assert';

Cannery.registerModel('Place', {
    fields: {
        id: Number,
        name: String
    }
});

Cannery.registerModel('Performer', {
    fields: {
        id: Number,
        name: String
    }
});

Cannery.registerModel('Event', {
    fields: {
        id: Number,
        name: String,
        address: {
            lat: Number,
            lon: Number,
            preferences: {
                color: String,
                names: [String]
            }
        },
        performer_ids: [Number],
        place_id: Number
    },
    hasMany: {
        Performer: {
            map: 'performer_ids'
        }
    },
    hasOne: {
        Place: {
            map: 'place_id'
        }
    }
});

describe('Cannery Integration Tests', function () {

    describe('When we create a model', function () {

        it('Should allow us to get from it', function () {

            const event = Cannery.createModel('Event');

            assert.equal(event.get('name'), undefined);

            event.set('name', 'Event1');

            assert.equal(event.get('name'), 'Event1');

        });

        it('Should allow us to get and set object fields', function () {
            const event = Cannery.createModel('Event');

            event.get('address').get('lat');

            event.get('address').set('lat', 1);

            assert.equal(event.get('address').get('lat'), 1);
        });

        it('Should let us nest objects infinitely', function () {
            const event = Cannery.createModel('Event');

            event.get('address').get('preferences').set('color', 'red');

            assert.equal(event.get('address').get('preferences').get('color'), 'red');
        });

        it('Should support typed arrays', function () {
            const event = Cannery.createModel('Event');

            event.get('performer_ids').push(1);

            assert.deepEqual(event.get('performer_ids').all(), [1]);

            event.get('performer_ids').push(2);

            assert.deepEqual(event.get('performer_ids').all(), [1, 2]);

            assert.throws(function () {
                event.get('performer_ids').push('3');
            });

        });

        it('Should support deeply nested arrays in objects', function () {
            const event = Cannery.createModel('Event');

            event.get('address').get('preferences').get('names').push('Address Name 1');

            assert.deepEqual(event.get('address').get('preferences').get('names').all(), ['Address Name 1']);
        });

        it('Should throw an error if we try to set a field with the wrong type', function () {

            const event = Cannery.createModel('Event');

            event.set('id', 1);

            assert.throws(function () {
                event.set('id', 'id-1');
            });

        });

        it('Should be possible to get an existing model', function () {

            Cannery.dispatcher.dispatch({
                actionType: 'EVENT_FETCH_SUCCESS',
                data: {
                    id: 1,
                    name: 'The Event'
                }
            });

            const event = Cannery.getModel('Event', 1);

            assert.equal(event.get('name'), 'The Event');
        });

    });

});
