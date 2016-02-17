import Immutable from 'immutable';

let store = {
    models: {},
    modelTypes: {},
    queries: {},
    validations: {}
};

export const getStore = function () {
    return store;
};

export const setStore = function (newStore) {
    return store = newStore;
};
