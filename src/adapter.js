const modelName = Symbol();

class Adapter {

    constructor (model) {
        this[modelName] = model;
    }

    create (data) {
        return Promise.resolve(data);
    }

    destroy (id) {
        return Promise.resolve({});
    }

    findAll (query) {
        return Promise.resolve([]);
    }

    findOne (id) {
        return Promise.resolve({});
    }

    getModel () {
        return this[modelName];
    }

    update (id, data) {
        return Promise.resolve(data);
    }

}

module.exports = Adapter;
