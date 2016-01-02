const extendHooks = require('../util/extendHooks');

module.exports = (options = {}) => {
    let value;

    return Object.assign({
        type: 'any'
    }, options, {
        hooks: extendHooks(options.hooks, {

            get: () => {
                return value;
            },

            set: (val) => {
                value = val;
            }

        })
    });

};
