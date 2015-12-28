module.exports = (options = {}) => {

    const hooks = options.hooks || {};

    return Object.assign({}, options, {
        type: 'boolean',
        hooks: Object.assign({}, hooks, {
            get: (val) => {
                let parseVal = Boolean(val);

                if (val === 'false') {
                    parseVal = false;
                }

                if (hooks.get) {
                    parseVal = hooks.get(parseVal);
                }

                return parseVal;
            }
        })
    });
};
