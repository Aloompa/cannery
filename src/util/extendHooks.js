module.exports = (firstHooks = {}, secondHooks = {}) => {
    let hooks = {};

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
