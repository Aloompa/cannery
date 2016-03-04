'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RequestCache = function () {
    function RequestCache() {
        _classCallCheck(this, RequestCache);

        this._cache = {};
    }

    _createClass(RequestCache, [{
        key: 'getKey',
        value: function getKey() {
            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            if (!Object.keys(options).length) {
                return '_no-options';
            }

            return JSON.stringify(options);
        }
    }, {
        key: 'get',
        value: function get(options) {
            var key = this.getKey(options);
            return this._cache[key];
        }
    }, {
        key: 'set',
        value: function set(options, data) {
            var key = this.getKey(options);
            this._cache[key] = data || [];
        }
    }, {
        key: 'clear',
        value: function clear(options) {
            if (options) {
                var key = this.getKey(options);
                delete this._cache[key];
            } else {
                this._cache = {};
            }
        }
    }]);

    return RequestCache;
}();

module.exports = RequestCache;