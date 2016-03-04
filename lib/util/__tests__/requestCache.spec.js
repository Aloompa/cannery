'use strict';

var assert = require('assert');
var RequestCache = require('../requestCache');

describe('The RequestCache', function () {
    it('Should return a key if it exists', function () {
        var cache = new RequestCache();
        var options = {
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

    it('Should set an empty object if there is no data', function () {
        var cache = new RequestCache();
        var options = {
            qs: {
                page: 1
            }
        };

        cache.set(options);

        assert.deepEqual(cache.get(options), []);
    });
});