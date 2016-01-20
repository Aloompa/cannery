'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = require('cannery-event-emitter');
var addListenersUtil = require('./util/addListeners');
var Adapter = require('cannery-adapter');
var ObjectType = require('./types/object');
var fields = Symbol();
var isFetched = Symbol();
var _isChanged = Symbol();
var doFetch = Symbol();

var Model = (function (_EventEmitter) {
    _inherits(Model, _EventEmitter);

    function Model(id, options) {
        _classCallCheck(this, Model);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Model).call(this));

        _this.id = id;
        _this[fields] = new ObjectType(_this.getFields.apply(_this, arguments), {
            parent: _this
        });
        _this[isFetched] = false;
        _this.options = options;

        addListenersUtil(_this, _this[fields]);

        _this.on('userChange', function () {
            _this[_isChanged] = true;
        });
        return _this;
    }

    _createClass(Model, [{
        key: doFetch,
        value: function value(options) {
            var parent = this.getParent();
            var adapter = this.getAdapter();

            options = Object.assign({}, options, this.options);

            if (parent) {
                return adapter.fetchWithin(this, parent, options);
            } else {
                return adapter.fetch(this, options);
            }
        }
    }, {
        key: 'apply',
        value: function apply(data) {
            this[isFetched] = true;
            this[fields].apply(data);
            return this;
        }
    }, {
        key: 'destroy',
        value: function destroy(options) {
            return this.getAdapter().destroy(this, options);
        }
    }, {
        key: 'get',
        value: function get(key) {

            if (!this[isFetched] && this.id) {
                this[isFetched] = true;
                this.refresh();
            }

            return this[fields].get(key);
        }
    }, {
        key: 'getAdapter',
        value: function getAdapter() {
            return new Adapter();
        }
    }, {
        key: 'getParent',
        value: function getParent() {
            return null;
        }
    }, {
        key: 'getFields',
        value: function getFields() {
            throw new Error('The getFields() method is not defined');
        }
    }, {
        key: 'isChanged',
        value: function isChanged() {
            return this[_isChanged];
        }
    }, {
        key: 'refresh',
        value: function refresh(options) {
            var _this2 = this;

            this.emit('fetching');

            return this[doFetch](options).then(function (data) {
                _this2.apply(data);
                _this2.emit('fetchSuccess');
                return _this2;
            }).catch(function (e) {
                _this2.emit('fetchError', e);
                return new Error(e);
            });
        }
    }, {
        key: 'set',
        value: function set(key, value) {
            this[fields].set(key, value);
            return this;
        }
    }, {
        key: 'save',
        value: function save(options) {
            var _this3 = this;

            var requestType = this.id ? 'update' : 'create';

            try {
                this.validate();
            } catch (e) {
                return Promise.reject(e);
            }

            return this.getAdapter()[requestType](this, options).then(function (data) {
                if (!_this3.id) {
                    _this3.id = data.id;
                }

                _this3[_isChanged] = false;

                return _this3.apply(data);
            });
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {
            return this[fields].toJSON();
        }
    }, {
        key: 'validate',
        value: function validate(key) {
            this[fields].validate(key);
            return this;
        }
    }], [{
        key: 'all',
        value: function all(options) {
            return new this().getAdapter().findAll(this, options).then(this.applyModels.bind(this));
        }
    }, {
        key: 'applyModels',
        value: function applyModels(arr) {
            var _this4 = this;

            var models = [];

            arr.forEach(function (obj) {
                var model = new _this4(obj.id);
                model.apply(obj);
                models.push(model);
            });

            models.on = function (evt, callback) {
                var subscriptions = [];

                models.forEach(function (model) {
                    subscriptions.push(model.on(evt, callback));
                });

                return subscriptions;
            };

            return models;
        }
    }]);

    return Model;
})(EventEmitter);

module.exports = Model;