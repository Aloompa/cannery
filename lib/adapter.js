"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var modelName = Symbol();

var Adapter = (function () {
    function Adapter(model) {
        _classCallCheck(this, Adapter);

        this[modelName] = model;
    }

    _createClass(Adapter, [{
        key: "create",
        value: function create(data) {
            return Promise.resolve(data);
        }
    }, {
        key: "destroy",
        value: function destroy(id) {
            return Promise.resolve({});
        }
    }, {
        key: "findAll",
        value: function findAll(query) {
            return Promise.resolve([]);
        }
    }, {
        key: "findOne",
        value: function findOne(id) {
            return Promise.resolve({});
        }
    }, {
        key: "getModel",
        value: function getModel() {
            return this[modelName];
        }
    }, {
        key: "update",
        value: function update(id, data) {
            return Promise.resolve(data);
        }
    }]);

    return Adapter;
})();

module.exports = Adapter;