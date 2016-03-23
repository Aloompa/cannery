/* @flow */

class ModelStore {
    constructor (Model: Function, context: Object) {
        if (!Model || !context) {
            throw new Error('ModelStore must be scoped and typed');
        }

        this.Model = Model;
        this._context = context;
        this._models = {};
        this._listeners = [];
        this._eventHandler = () => {};
    }

    setEventHandler (fn: Function) {
        this._eventHandler = fn;
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

            const storedModel = this.get(id);

            if (storedModel) {
                storedModel.apply(modelData);
            } else {
                const newModel = this.instantiateModel(id).apply(modelData);
                this._models[id] = newModel;
            }
        });

        return ids;
    }

    addExisting (model: Object, id: String) {
        const normalizedId = String(id);
        this._models[normalizedId] = model;
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

        const modelListeners = this.listeners.filter((listener) => {
            return String(listener.model.id) === normalizedId;
        });

        modelListeners.forEach((listener) => {
            listener.model.off(listener.event, listener.fn);
        });

        this._listeners = this._listeners.filter((listener) => {
            return modelListeners.indexOf(listener) >= 0;
        });
    }

    instantiateModel (id: ?string, options: Object = {}): Object {
        const Model = this.Model;
        let newModel =  new Model(this._context, id, options);

        return newModel;
    }

    clear () {
        let listener = this._listeners.pop();
        while (listener) {
            listener.model.off(listener.event, listener.fn);
            listener = this._listeners.pop();
        }

        this._models = {};
    }

    _handleDestroy (model: Object) {
        this.remove(model.id);
    }

    _listen (model: Object) {
        let startFn = newModel.on('*', (...args) => {
            this._eventHandler(...args);
        });
        this._listeners.push({
            event: '*',
            model: newModel,
            fn: startFn
        });

        let destroyFn = newModel.once('destroy', this._handleDestroy.bind(this));
        this._listeners.push({
            event: 'destroy',
            model: newModel,
            fn: destroyFn
        });
    }
}

module.exports = ModelStore;
