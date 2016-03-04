

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MultiModel = require('./multiModel');

var HasMany = function (_MultiModel) {
    _inherits(HasMany, _MultiModel);

    function HasMany(parentModel, Model, options) {
        _classCallCheck(this, HasMany);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HasMany).apply(this, arguments));

        _this.modelStore = parentModel.findOwnsMany(Model);
        _this._models = {};
        return _this;
    }

    _createClass(HasMany, [{
        key: 'on',
        value: function on(action, callback) {
            var _this2 = this;

            this._listeners[action] = [];
            this._listeners[action].callback = callback;

            Object.keys(this._models).forEach(function (id) {
                _this2._listeners[action].push({
                    model: _this2._models[id],
                    event: _this2._models[id].on(action, callback)
                });
            });
        }
    }, {
        key: 'store',
        value: function store(response) {
            this.modelStore.store(response);
        }
    }, {
        key: 'fetch',
        value: function fetch(id) {
            this.modelStore.fetch(id);
        }
    }, {
        key: 'requestOne',
        value: function requestOne(id, options) {
            this.modelStore.requestOne(id, options);
        }
    }, {
        key: 'requestMany',
        value: function requestMany(options) {
            this.modelStore.requestMany(options);
        }
    }, {
        key: 'add',
        value: function add(model, index) {
            _get(Object.getPrototypeOf(HasMany.prototype), 'add', this).apply(this, arguments);
            this.modelStore.add(model);
            return this;
        }
    }, {
        key: 'all',
        value: function all() {
            var _this3 = this;

            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            return this.map.map(function (id) {
                return _this3.modelStore.get(id);
            }).filter(function (model) {
                return model && !model.getState('isDestroyed');
            });
        }
    }, {
        key: 'get',
        value: function get(id) {
            return this.modelStore.get(id);
        }
    }]);

    return HasMany;
}(MultiModel);

module.exports = HasMany;