const extendHooks = require('../util/extendHooks');
const parseFields = require('../util/parseFields');

module.exports = (Model, options) => {
    if (!options.map) {
        const modelName = Model.getName().toLowerCase();
        options.map = `${modelName}_ids`;
    }

    const model = new Model();

    const fields = model.getFields();

    const parsedFields = parseFields(fields);

    let isFetched = false;

    const config = Object.assign({
        type: 'object'
    }, options, {
        hooks: extendHooks(options.hooks, {

            get: (key) => {
                return parsedFields[key].hooks.get();
            },

            set: (key, value) => {
                parsedFields[key].hooks.set(value);
                return this;
            },

            pull: () => {

            },

            pullFilter: () => {

            },

            push: () => {

            },

            pushFilter: () => {

            },

            fetching: () => {

            },

            fetchSuccess: () => {

            },

            fetchError: () => {

            }

        })
    });

    return config;

};
