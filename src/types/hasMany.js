module.exports = (Model, options = {}) => {
    if (!options.map) {
        const modelName = Model.getName().toLowerCase();
        options.map = `${modelName}_ids`;
    }

    return Object.assign({
        model: Model,
        type: 'array',
        requestType: 'multiple'
    }, options);
};
