/* @flow */

class ModelStore {

    _models: Object;
    _listeners: Array<Object>;
    _eventHandler: Function;
    _context: Object;
    Model: Function;

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

    get (id: string) : Object {
        let normalizedId = String(id);
        return this._models[id];
    }

    apply (response: Object) : Array<string> {
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

    addExisting (model: Object, id: string) {
        const normalizedId = String(id);
        this._models[normalizedId] = model;
        this._listen(model);
    }

    stub (id: string) : Object {
        const newModel = this.instantiateModel(id);
        this._models[id] = newModel;
        return newModel;
    }

    all () : Array<Object> {
        return Object.keys(this._models).map((id) => {
            return this._models[id];
        });
    }

    remove (id: string) : void {
        let normalizedId = String(id);

        if (this._models[normalizedId]) {
            delete this._models[normalizedId];
        }

        const modelListeners = this._listeners.filter((listener) => {
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

        this._listen(newModel);
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
        let starFn = model.on('*', (...args) => {
            this._eventHandler(...args);
        });

        this._listeners.push({
            event: '*',
            model: model,
            fn: starFn
        });

        let destroyFn = model.once('destroy', this._handleDestroy.bind(this));
        this._listeners.push({
            event: 'destroy',
            model: model,
            fn: destroyFn
        });
    }
}

module.exports = ModelStore;
