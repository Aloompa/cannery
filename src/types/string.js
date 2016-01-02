const extendHooks = require('../util/extendHooks');
const baseType = require('./base');

module.exports = (options = {}) => {

    const config = Object.assign({
        type: 'string'
    }, options, {
        hooks: extendHooks(options.hooks, {

            get: (val) => {
                return String(val);
            }

        })
    });

    return baseType(config);
};
