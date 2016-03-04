

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MultiModel = require('./multiModel');
var RequestCache = require('../util/requestCache');

var OwnsMany = function (_MultiModel) {
    _inherits(OwnsMany, _MultiModel);

    function OwnsMany() {
        _classCallCheck(this, OwnsMany);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(OwnsMany).apply(this, arguments));

        _this.requestCache = new RequestCache();
        _this._models = {};
        return _this;
    }

    _createClass(OwnsMany, [{
        key: '_getModelById',
        value: function _getModelById(id) {
            return this._models[id];
        }
    }, {
        key: 'on',
        value: function on(action, callback) {
            var _this2 = this;

            this._listeners[action] = [];
            this._listeners[action].callback = callback;

            // Listen to existing models
            Object.keys(this._models).forEach(function (id) {
                _this2._listeners[action].push({
                    model: _this2._models[id],
                    event: _this2._models[id].on(action, callback)
                });
            });
        }

        // @override

    }, {
        key: 'requestOne',
        value: function requestOne(id, options) {
            var model = this._getModelById(id);

            if (!model) {
                model = this._instantiateModel(id);
            }

            model.getAdapter().fetch(model, options, function (response) {
                model.apply(response);
            });

            return model;
        }

        // @override

    }, {
        key: 'requestMany',
        value: function requestMany() {
            var _this3 = this;

            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var model = this._instantiateModel();

            model.getAdapter().findAll(this.Model, this._parent, options, function (response) {
                return _this3.apply(response).applyQueryResults(response, options);
            });

            return this;
        }
    }, {
        key: 'apply',
        value: function apply(data) {
            var _this4 = this;

            data.forEach(function (item) {
                var model = _this4._instantiateModel();

                _this4._models[item.id] = model;
                model.apply(item);
            });

            return this;
        }
    }, {
        key: 'applyQueryResults',
        value: function applyQueryResults(data) {
            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            var idKey = this.Model.getFieldId();

            var ids = data.map(function (modelData) {
                return modelData[idKey];
            });

            this.requestCache.set(options, ids);

            return this;
        }
    }, {
        key: 'all',
        value: function all() {
            var _this5 = this;

            return this.map.map(function (id) {
                return _this5._models[id];
            });
        }
    }, {
        key: 'add',
        value: function add(model, index) {
            _get(Object.getPrototypeOf(OwnsMany.prototype), 'add', this).apply(this, arguments);

            this._models[model.id] = model;

            return this;
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {
            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            if (options.recursive) {
                return this.all().map(function (model) {
                    return model.toJSON(options);
                });
            }

            return [];
        }
    }, {
        key: 'query',
        value: function query() {
            var _this6 = this;

            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var ids = this.requestCache.get(options);

            if (ids) {
                var models = ids.map(function (id) {
                    return _this6._models[id];
                });

                var anyDestroyed = models.filter(function (model) {
                    return model.getState('isDestroyed');
                }).length;

                if (!anyDestroyed) {
                    return models;
                }
            }

            this.requestMany(options);
            return [];
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            this.requestCache.clear();
        }
    }]);

    return OwnsMany;
}(MultiModel);

module.exports = OwnsMany;