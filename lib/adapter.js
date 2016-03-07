

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultOptions = {
    excludeUnchanged: false
};

var Adapter = function () {
    function Adapter(options) {
        _classCallCheck(this, Adapter);

        this.options = Object.assign({}, defaultOptions, options || {});
    }

    _createClass(Adapter, [{
        key: 'getAncestry',
        value: function getAncestry(model) {
            var modelScope = model.getScope();

            if (!modelScope) {
                return [];
            }

            return this.getAncestry(modelScope).concat(model);
        }
    }, {
        key: 'getPathObject',
        value: function getPathObject(model) {
            if (Array.isArray(model)) {
                return model.map(this.getPathObject);
            } else if (model.constructor.getKey) {
                var obj = {
                    key: model.constructor.getKey(),
                    keySingular: model.constructor.getKey(true)
                };

                if (model.id) {
                    obj.id = model.id;
                }

                return obj;
            } else if (model.getKey) {
                return {
                    key: model.getKey(),
                    keySingular: model.getKey(true)
                };
            } else {
                return {
                    key: model.toString()
                };
            }
        }
    }, {
        key: 'getPath',
        value: function getPath(model) {
            var ancestory = this.getAncestry(model);
            return this.getPathObject(ancestory);
        }
    }, {
        key: 'getRoot',
        value: function getRoot(model) {
            return this.getAncestry(model)[0];
        }
    }, {
        key: 'makeRequest',
        value: function makeRequest(request, callback) {
            throw new Error('makeRequest is virtual and must be overriden.');
        }
    }, {
        key: 'fetch',
        value: function fetch(model, options, callback) {
            return this.makeRequest({
                requestType: 'fetch',
                path: this.getPath(model),
                id: model.id,
                payload: null,
                options: options
            }, function (response, err) {
                if (err) {
                    model.emit('error', err);
                    return;
                }

                callback(response);
            });
        }
    }, {
        key: 'fetchWithin',
        value: function fetchWithin(Model, context, options, callback) {
            return this.makeRequest({
                requestType: 'fetchWithin',
                path: this.getPath(context).concat(this.getPathObject(Model)),
                id: null,
                payload: null,
                options: options
            }, function (response, err) {
                if (err) {
                    context.emit('error', err);
                    return;
                }

                callback(response);
            });
        }
    }, {
        key: 'findAll',
        value: function findAll(Model, context, options, callback) {
            return this.makeRequest({
                requestType: 'findAll',
                path: this.getPath(context).concat(this.getPathObject(Model)),
                id: null,
                payload: null,
                options: options
            }, function (response, err) {
                if (err) {
                    context.emit('error', err);
                    return;
                }

                callback(response);
            });
        }
    }, {
        key: 'create',
        value: function create(model, context, options, callback) {
            return this.makeRequest({
                requestType: 'create',
                path: this.getPath(context).concat(this.getPathObject(model)),
                id: null,
                payload: model.toJson(),
                options: options
            }, function (response, err) {
                if (err) {
                    context.emit('error', err);
                    return;
                }

                callback(response);
            });
        }
    }, {
        key: 'update',
        value: function update(model, options, callback) {
            return this.makeRequest({
                requestType: 'update',
                path: this.getPath(model),
                id: model.id,
                payload: model.toJson({ excludeUnchanged: this.options.excludeUnchanged }),
                options: options
            }, function (response, err) {
                if (err) {
                    model.emit('error', err);
                    return;
                }

                callback(response);
            });
        }
    }, {
        key: 'destroy',
        value: function destroy(model, options, callback) {
            return this.makeRequest({
                requestType: 'destroy',
                path: this.getPath(model),
                id: model.id,
                payload: null,
                options: options
            }, function (response, err) {
                if (err) {
                    model.emit('error', err);
                    return;
                }

                callback(response);
            });
        }
    }]);

    return Adapter;
}();

module.exports = Adapter;