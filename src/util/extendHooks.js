/* @flow */

'use strict';

module.exports = (firstHooks: Object, secondHooks: Object): Object => {
    let hooks = {};

    firstHooks = firstHooks || {};
    secondHooks = secondHooks || {};

    Object.keys(secondHooks).forEach((hook) => {
        hooks[hook] = (val, val2) => {
            val = secondHooks[hook](val, val2);

            if (firstHooks[hook]) {
                val = firstHooks[hook](val);
            }

            return val;
        };
    });

    return Object.assign({}, firstHooks, hooks);
};
