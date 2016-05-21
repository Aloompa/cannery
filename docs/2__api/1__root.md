# Cannery Root

Every Cannery application should have exactly one `Cannery.Root`.

The Root is a container for all of your models. All events in your models will bubble up to your root, so if you listen for events on the root, you will get everything, which is probably what you want if you're view layer is modern and component-based.

The root is meant to be extended by another class. It is not very useful otherwise.

### Example

```javascript
import Cannery from 'cannery';
import Animal from './animalModel';
import Zookeeper from './zookeeperModel';

class Zoo extends Cannery.Root {

    getAdapter () {
        return this._adapter;
    }

    getFields () {
        return {
            animals: this.define(Cannery.Types.OwnsMany, Animal),
            zookeepers: this.define(Cannery.Types.OwnsMany, Zookeeper)
        };
    }

}

const zoo = new Zoo();

zoo.get('animals').all();
```


### API

#### Methods

`apply(Object): Root`

This applies an object of plain JSON data to the root and the models underneath. From the root, you can literally pass in an object describing your entire application if you need to. This method is used heavily under the hood to add data to the models as remote data store responses are resolved.

Example:

```javascript
class Monkey extends Cannery.Model {
	getFields () {
		return {
			name: Cannery.Types.StringType,
			id: Cannery.Types.StringType
		};
	}
}

class Zoo extends Cannery.Root {
	getFields () {
		return {
			monkeys: this.define(OwnsMany, Monkey)
		};
	}
}

const myZoo = new Zoo();

myZoo.apply({
	monkeys: [{
		id: '1',
		name: 'Curious George'
	}, {
		id: '2',
		name: 'King Kong'
	}]
});
```

Please note, this method should not be used in response to user interactions, such as entering data in a form. User interactions should be applied using the `get()` method.

---

`define(Type, ...arguments): Function`

This is a convenience method to be used in the `getFields()` method. It takes a type such as OwnsOne, OwnsMany, HasOne or HasMany and the model that you want to apply to and return a function to initialize the relationship with. This ensures that we are instantiating only after the model is initialized and helps get around circular dependency issues you might otherwise encounter.

Example:

```javascript
class Zoo extends Cannery.Root {
	getFields () {
		return {
			monkeys: this.define(OwnsMany, Monkey)
		};
	}
}
```

---

`emit(eventName: string, payload: ?Object)`

Emits an event to the root. This is mainly used internally. You'll probably never need it.

---

`get(key: string): any`

Returns a key from the instantiated fields.

Example:

```javascript
class Zoo extends Cannery.Root {
	getFields () {
		return {
			monkeys: this.define(OwnsMany, Monkey)
		};
	}
}

const myZoo = new Zoo();
myZoo.get('monkeys').all();
```

---

`getAdapter(): Adapter`

One of the biggest advantages of Cannery is its ability to easily switch out your data source or even type of data requesting mechanism with an adapter.

By default, we use our built-in rest adapter, but you can easily write your own adapter to handle your specific case.

The `getAdapter()` method can be overridden to return whatever adapter you need.

Example:

```javascript
class Zoo extends Cannery.Root {

	constructor () {
		super();

		this._adapter = new MyAwsomeAdapter();
	}

	getAdapter () {
		return this._adapter;
	}
}
```

---

`getFields(): Object`

This method must be defined on your Root class. It should return an object with the field definitions for your root.

In most applications, all of your root fields will probably be OwnsMany relationships.

Example:

```javascript
class Zoo extends Cannery.Root {
	getFields () {
		return {
			monkeys: this.define(OwnsMany, Monkey),
			giraffes: this.define(OwnsMany, Giraffe)
		};
	}
}
```

---

`on(eventName: string, callback: Function)`

Listens for an  event to be triggered by event name.

Example:

```javascript
myZoo.on('error', (err) => {
	console.log('An error occurred', err);
});
```

---

`off(eventName: string, event: Function)`

Stops listening on an event.

Example:

```javascript
const onError = myZoo.on('error', (err) => {
	console.log('An error occurred', err);
});

// Errors will no longer be listened to
myZoo.off('error', onError);
```

---

`set(key: string, value: any): Root`

Sets the value of a field.

Example:

```javascript
class Zoo extends Cannery.Root {

	getFields () {
		return {
			name: Cannery.Types.StringType
		};
	}

}

const myZoo = new Zoo();
myZoo.set('name', 'Nashville Zoo');
```

---

`toJSON(options: Object): Object`

Converts the entire model tree to a plain JSON object.

Example:

```javascript
console.log(myZoo.toJSON());

/** Returns:
{
	monkeys: [{
		id: '1',
		name: 'Curious George'
	}, {
		id: '2',
		name: 'King Kong'
	}]
}
*/
```

---

#### Events

In its core, Cannery is event-driven. All of the events in any model underneath the root bubble up to the root.

`"change"`

This event is fired every time a change happens to the root or any models. This can occur if data is resolved and applied to a model or if a user makes a change to the model.

For example:

```javascript
zoo.on('change', () => {
	console.log('I changed')
});

// This triggers it
zoo.animals.get('1').set('name', 'Monkey');

// and this triggers it
zoo.animals.get('1').apply({
	name: 'Monkey'
});

// This also triggers it
zoo.emit('change');
```

---

`"deleteError", error : Object`

This is triggered any time a delete responds with an error from the remote datasource. This can be helpful for informing your user that an error has occurred.

---

`"destroy"`

This is triggered after a model is destroyed.

---

`"fetching"`

This is triggered anytime we begin fetching a model or collection of models.

---

`"fetchError", error : Object`

This is triggered anytime a fetch responds with an error from our data source. The error returned from the server will be available as the first argument.

---

`"fetchSuccess"`

This is triggered anytime we successfully fetch a model or collection of models.

---

`"saveError", error : Object`

This is triggered anytime there is an error saving a model.

---

`"saveSuccess"`

This is triggered anytime a model is successfully saved.

---

`"userChange"`

This is triggered anytime a user changes a model. On most types, this is the result of doing a `set()` but with more complex types like an array, this can also be the result of a `move()`, `add()`, `remove()` or `removeAll()`.

---
