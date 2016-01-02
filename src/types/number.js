const extendHooks = require('../util/extendHooks');
const baseType = require('./base');

module.exports = (options = {}) => {

    const config = Object.assign({
        type: 'number'
    }, options, {
        hooks: extendHooks(options.hooks, {

            get: (val) => {
                return parseFloat(val);
            }

        })
    });

    return baseType(config);
};
