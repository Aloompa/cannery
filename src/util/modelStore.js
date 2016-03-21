/* @flow */
class ModelStore {
    constructor (Model: Function, context: Object) {
        this.Model = Model;
        this._models = {};
        this._listeners = {};
    }

    get (id: String) : Object {
        let normalizedId = String(id);
        return this._models[id];
    }

    apply (response: Object) : Array<String> {
        const models = Array.isArray(response) ? response : [response];
        const idKey = this.Model.getFieldId();
        const ids = [];

        models.forEach((modelData) => {
            const id = String(modelData[idKey]);
            ids.push(id);

            const storedModel = this.getModel(id);

            if (storedModel) {
                storedModel.apply(modelData);
            } else {
                const newModel = this.instantiateModel(id).apply(modelData);
                this._models[id] = newModel;
            }
        });

        return ids;
    }

    stub (id: String) : Object {
        const newModel = instantiateModel(id);
        this._models[id] = newModel;
        return newModel;
    }

    all () : Array<Object> {
        return Object.keys(this._models).map((id) => {
            return this._models[id];
        });
    }

    remove (id: String) : void {
        let normalizedId = String(id);

        if (this._models[normalizedId]) {
            delete this._models[normalizedId];
        }
    }

    instantiateModel (id: ?string, options: Object = {}): Object {
        const Model = this.Model;
        let newModel =  new Model(this._context, id, options);

        this.newModel.once('destroy', this._handleDestroy.bind(this));

        return newModel;
    }

    clear () {
        this._models = {};
    }

    _handleDestroy (model: Object) {
        this.remove(model.id)
    }
}

module.exports = ModelStore;
