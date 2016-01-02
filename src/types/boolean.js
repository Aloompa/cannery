const extendHooks = require('../util/extendHooks');
const baseType = require('./base');

module.exports = (options = {}) => {

    const config = Object.assign({
        type: 'boolean'
    }, options, {
        hooks: extendHooks(options.hooks, {

            get: (val) => {
                let parseVal = Boolean(val);

                if (val === 'false') {
                    parseVal = false;
                }

                return parseVal;
            }

        })
    });

    return baseType(config);
};
