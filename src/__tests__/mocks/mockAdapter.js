class MockAdapter {

    create (model) {
        let data = model.toJSON();
        data.id = 1;
        return Promise.resolve(data);
    }

    destroy (model) {
        return Promise.resolve(null);
    }

    fetch (model) {
        return Promise.resolve({
            name: 'Edvard Munch',
            id: 3
        });
    }

    update (model) {
        return Promise.resolve(model.toJSON());
    }

}

module.exports = MockAdapter;
