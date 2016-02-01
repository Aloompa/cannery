'use strict';

const assert = require('assert');
const RequestCache = require('../requestCache');

describe('The RequestCache', () => {
    it('Should return a key if it exists', () => {
        const cache = new RequestCache();
        const options = {
            qs: {
                page: 1
            }
        };

        cache.set(options, {
            id: 2
        });

        assert.equal(cache.get(options).id, 2);

        cache.clear(options);

        assert.ok(!cache.get(options));
    });

    it('Should set an empty object if there is no data', () => {
        const cache = new RequestCache();
        const options = {
            qs: {
                page: 1
            }
        };

        cache.set(options);

        assert.deepEqual(cache.get(options), []);
    });
});
