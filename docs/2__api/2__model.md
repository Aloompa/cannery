# Cannery Model

Cannery models are the bread and butter of Cannery. Multiple models can be composed together to form complex relationships.

Each model is represented with a class that extends the Cannery.Model like this:

```javascript
import Cannery from 'cannery';
const { StringType } = Cannery.Types;

class Monkey extends Cannery.Model {
	getFields () {
		return {
			name: StringType,
			id: StringType
		};
	}
}
```

### API

#### Methods

`setState(key: string, value: any): Model`

---

`setStateFor(field: string, key: string, value: any): Model`

---

`getState(key: string): any`

---

`getStateFor(field: string, key: string): any`

---

`apply(data: Object): Model`

---

`define(Type: Function): Function`

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
