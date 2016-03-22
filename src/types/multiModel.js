/* @flow */

'use strict';

const BaseType = require('./base');

class MultiModel extends BaseType {

    constructor (parentModel: Object, Model: Function, options: Object = {}) {
        super(parentModel, options || {});

        this._watchedModels = [];
        this.options = options;
        this.map = options.map;
        this.Model = Model;
        this._listeners = {};
    }

    _getRandomKey (): number {
        return new Date().getTime();
    }

    _remove (model: Object): Object {

        if (!this.map) {
            throw new Error(`An unmapped ${this.constructor.name} cannot be removed`);
        }

        const mapIds = this.map.all();
        const removeIndex = mapIds.indexOf(model.id);

        if (removeIndex >= 0) {
            this.map.remove(removeIndex);
        }

        return this;
    }

    store (response: Array<Object>): void {
        throw new Error('MultiModel is virtual. It must be extended, and store() must be overriden');
    }

    fetch (id: string): Object {
        throw new Error('MultiModel is virtual. It must be extended, and fetch() must be overriden');
    }

    requestOne (id: string, options: ?Object): void {
        throw new Error('MultiModel is virtual. It must be extended, and requestOne() must be overriden');
    }

    requestMany (options: Object): void {
        throw new Error('MultiModel is virtual. It must be extended, and requestMany() must be overriden');
    }

    move (model: Object, newIndex: number): Object {

        if (!this.map) {
            throw new Error('An unmapped OwnsMany cannot be moved');
        }

        const mapIds = this.map.all();
        const moveIndex = mapIds.indexOf(model.id);

        if (moveIndex >= 0) {
            this.map.move(moveIndex, newIndex);
        }

        return this;
    }

    map (): Array<Object> {
        if (arguments.length === 1) {
            return this.all().map(arguments[0]);
        }

        return this.query(arguments[0]).map(arguments[1]);
    }

    length () {
        return this.all().length;
    }

}

module.exports = MultiModel;
