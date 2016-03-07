const assert = require('assert');
const Zoo = require('../models/Zoo');
const TestAdapter = require('../testAdapter');

let testAdapter = new TestAdapter();

class TestingZoo extends Zoo {
    getAdapter () {
        return testAdapter;
    }

    static getKey (singular) {
        return 'zoo';
    }
}

describe('Adapter', () => {
    let zoo = new TestingZoo();

    describe('When we get exhibits on the zoo', () => {
        let request = null;

        testAdapter.checkRequest((req) => {
            request = req;
        });

        testAdapter.mockData([
            {
                id: 1,
                name: 'Lions and Tigers and Bears',
                animalIds: [1, 2, 3]
            },
            {
                id: 2,
                name: 'Empty Cage',
                animalIds: []
            }
        ]);

        zoo.get('exhibits').requestMany();

        assert.deepEqual(request.path, [{key: 'exhibits', keySingular: 'exhibit'}]);
    });


});
