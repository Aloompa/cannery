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
    describe('Path creation', () => {
        let zoo = new TestingZoo();

        it('Should get exhibits from the Zoo', () => {
            let request = null;

            testAdapter.checkRequest((req) => {
                request = req;
            });

            zoo.get('exhibits').requestMany();
            assert.deepEqual(request.path, [{key: 'zoo', keySingular: 'zoo'}, {key: 'exhibits', keySingular: 'exhibit'}]);
        });

    });
        zoo.get('exhibits').all();
    });
});
