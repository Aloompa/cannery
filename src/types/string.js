module.exports = (options = {}) => {

    const hooks = options.hooks || {};

    return Object.assign({}, options, {
        type: 'string',
        hooks: Object.assign({}, hooks, {
            get: (val) => {
                let parseVal = String(val);

                if (hooks.get) {
                    parseVal = hooks.get(parseVal);
                }

                return parseVal;
            }
        })
    });
};
