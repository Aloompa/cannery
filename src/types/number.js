module.exports = (options = {}) => {

    const hooks = options.hooks || {};

    return Object.assign({}, options, {
        type: 'number',
        hooks: Object.assign({}, hooks, {
            get: (val) => {
                let parseVal = parseFloat(val);

                if (hooks.get) {
                    parseVal = hooks.get(parseVal);
                }

                return parseVal;
            }
        })
    });
};
