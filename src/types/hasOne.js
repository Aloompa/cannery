/* @flow */

'use strict';

const BaseType = require('./base');
const addListenersUtil = require('../util/addListeners');

class HasOne extends BaseType {

    constructor (owner: Object, Model: Function, options: { map: string }) {
        super(owner, options || {});

        this.options = options || {};
        this._map = this.options.map;
        this._ModelConstructor = Model;
    }

    _getId () {
        if (!this._map) {
            return;
        }

        return (typeof this._map.get === 'function') ? this._map.get() : this._map;
    }

    _updateMapping () {
        if (this._getId() !== this._model.id) {
            this._model.id = this._getId();
            this._model.emit('change');
        }
    }

    setParent () {
        if (!this._model) {
            return;
        }

        this._model.getParent = () => {
            return this.parent;
        };

        this._updateMapping();

        this.parent.on('change', this._updateMapping.bind(this));

        addListenersUtil(this.parent, this._model);
    }

    get (): Object {
        if (!this._model) {
            this._model = new this._ModelConstructor(this._getId(), this.options);

            this._model.on('change', () => {
                this.emit('change');
            });

            this.setParent();
        }

        return this._model;
    }

    toJSON (options: Object = {}): any {
        if (options.recursive) {
            return super.toJSON(options);
        }

        return undefined;
    }

}

module.exports = HasOne;
