class MockErrorAdapter {

    create (model) {
        return Promise.reject('Error Message');
    }

    destroy (model) {
        return Promise.reject('Error Message');
    }

    fetch (model) {
        return Promise.reject('Error Message');
    }

    update (model) {
        return Promise.reject('Error Message');
    }

}

module.exports = MockErrorAdapter;
