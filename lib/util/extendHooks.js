'use strict';

module.exports = function () {
    var firstHooks = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var secondHooks = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var hooks = {};

    Object.keys(secondHooks).forEach(function (hook) {
        hooks[hook] = function (val, val2) {
            val = secondHooks[hook](val, val2);

            if (firstHooks[hook]) {
                val = firstHooks[hook](val);
            }

            return val;
        };
    });

    return Object.assign({}, firstHooks, hooks);
};