

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseType = require('./base');

var MultiModel = function (_BaseType) {
    _inherits(MultiModel, _BaseType);

    function MultiModel(parentModel, Model, options) {
        _classCallCheck(this, MultiModel);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MultiModel).call(this, parentModel, options || {}));

        _this._watchedModels = [];
        _this.options = options || {};
        _this.map = _this.options.map;
        _this.Model = Model;
        _this._listeners = {};
        return _this;
    }

    _createClass(MultiModel, [{
        key: '_instantiateModel',
        value: function _instantiateModel(id) {
            var _this2 = this;

            var Model = this.Model;

            var model = new Model(this._parent, id, this.options.modelOptions);

            // Add new models to any existing listeners
            Object.keys(this._listeners).forEach(function (listenerType) {
                var listener = _this2._listeners[listenerType];

                listener.push({
                    model: model,
                    event: model.on(listenerType, listener.callback)
                });
            });

            return model;
        }
    }, {
        key: '_getRandomKey',
        value: function _getRandomKey() {
            return new Date().getTime();
        }
    }, {
        key: 'create',
        value: function create() {
            var model = this._instantiateModel();

            this._models[this._getRandomKey()] = model;

            return model;
        }
    }, {
        key: 'off',
        value: function off(action) {
            var _this3 = this;

            var listenerKeys = Object.keys(this._listeners[action]);

            listenerKeys.forEach(function (listenerType) {
                var listener = _this3._listeners[listenerType];

                if (!listener) {
                    return;
                }

                listener.forEach(function (_ref) {
                    var model = _ref.model;
                    var event = _ref.event;

                    model.off(listenerType, event);
                });
            });
        }
    }, {
        key: 'store',
        value: function store(response) {
            throw new Error('MultiModel is virtual. It must be extended, and store() must be overriden');
        }
    }, {
        key: 'fetch',
        value: function fetch(id) {
            throw new Error('MultiModel is virtual. It must be extended, and fetch() must be overriden');
        }
    }, {
        key: 'requestOne',
        value: function requestOne(id, options) {
            throw new Error('MultiModel is virtual. It must be extended, and requestOne() must be overriden');
        }
    }, {
        key: 'requestMany',
        value: function requestMany(options) {
            throw new Error('MultiModel is virtual. It must be extended, and requestMany() must be overriden');
        }
    }, {
        key: 'get',
        value: function get(id) {
            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            var model = this._getModelById(id);

            if (model) {
                return model;
            } else {
                this.requestOne(id, options);
            }
        }
    }, {
        key: 'add',
        value: function add(model, index) {

            if (!this.map) {
                throw new Error('An unmapped OwnsMany cannot be added to');
            }

            this.map.add(model.id, index);

            return this;
        }
    }, {
        key: 'remove',
        value: function remove(model) {

            if (!this.map) {
                throw new Error('An unmapped ' + this.constructor.name + ' cannot be removed');
            }

            var mapIds = this.map.all();
            var removeIndex = mapIds.indexOf(model.id);

            if (removeIndex >= 0) {
                this.map.remove(removeIndex);
            }
        }
    }, {
        key: 'move',
        value: function move(model, newIndex) {

            if (!this.map) {
                throw new Error('An unmapped OwnsMany cannot be moved');
            }

            var mapIds = this.map.all();
            var moveIndex = mapIds.indexOf(model.id);

            if (moveIndex >= 0) {
                this.map.move(moveIndex, newIndex);
            }

            return this;
        }
    }]);

    return MultiModel;
}(BaseType);

module.exports = MultiModel;