# Cannery Types

Every Cannery Model and Root requires a `getFields()` method which returns an object that composes multiple Cannery Types. These types become the fields for your Cannery model and are accessible via getters and setters. Every type has a `get()`, `set()`, `toJSON()` and `apply()` method by default, but some types provide additional methods as well.

## Table Of Contents
* [AnyType](#anytype)
* [ArrayType](#arraytype)
* [BooleanType](#booleantype)
* [NumberType](#numbertype)
* [ObjectType](#objecttype)
* [StringType](#stringtype)

### AnyType

The AnyType is the most basic type in Cannery. It makes no assumptions about the structure of your data. All of the types provided with the Cannery library extend AnyType. If possible, avoid using this type directly and instead use a type such as the StringType or NumberType for more control over the format of your data.

AnyType is a basic type, which means that it is only accessible through an ObjectType.

##### Api

No public API. This is a simple type.

##### Example

```JavaScript
import Cannery from 'cannery';

class Monkey extends Cannery.Root {

    getFields () {
        return {
            name: Cannery.Types.AnyType
        };
    }

}

const monkey = new Monkey();

monkey.set('name', 'George');
monkey.get('name'); // 'George'
monkey.set('name', 123);
monkey.get('name'); // 123

monkey.apply({
    name: 'Donkey Kong'
});

monkey.toJSON(); // { name: 'Donkey Kong' }
```

**[⬆ back to top](#table-of-contents)**

### ArrayType

The ArrayType allows you to have multiple of any other type and manipulate the array by adding, removing and moving records. Every Cannery ArrayType is typed, which means that it needs to be provided with the type of item that the array will contain. For simple types like strings, this looks like:

```JavaScript
class Monkey extends Cannery.Model {
    getFields () {
        return {
            'aliases': this.define(Cannery.Types.ArrayType, Cannery.Types.StringType)
        };
    }
}
```

Arrays that contain ObjectTypes need to also include a third argument in the `define()` method with the Object fields, like this:

```JavaScript
class Monkey extends Cannery.Model {
    getFields () {
        return {
            friends: this.define(Cannery.Types.ArrayType, Cannery.Types.ObjectType, {
                name: Cannery.Types.StringType,
                id: Cannery.Types.NumberType
            })
        };
    }
}
```

##### Api

`add(item: Object, index: number)`

Adds a new item to the array at the specified index. If no index is provided, the item is appended to the end of the array. Emits a "change" and "userChange" event.

---

`all() : Array<Object>`

Returns an array of all of the items. Each item returned can be accessed through getters / setters.

---

`apply(list: array)`

Accepts a JavaScript array and applies it to the cannery ArrayType. Emits a "change" event.

---

`get(index: number) : Object`

Returns the item in the ArrayType at the index provided. If there is no item at the provided index, this will return `undefined`.

---

`move(oldIndex: number, newIndex: number)`

Moves an array item from it's current index in the array to a new index. Emits a "change" and "userChange" event.

---

`on(eventType: string, callback: function) callback : Function`

Listen for events on the array. This is useful for reacting when the array is modified in some way by a "change" or "userChange" event. All Cannery events bubble up to the type, model and root that contain them and it is best practice to listen for events as high up the hierarchy as possible.

---

`off(eventType: string, callback: function)`

Pass in the event you subscribed to originally with the `on` method to unsubscribe from it.

```JavaScript
const onUserChange = myArrayType.on('userChange', () => {
    // ... Do Something
});

myArrayType.off('userChange', onUserChange);
```

---

`remove(index: number)`

Removes an item from the array at the index provided. Emits a "change" and "userChange" event.

---

`removeAll()`

Removes all of the items from the array. Emits a "change" and "userChange" event.

---

`toJSON() : Array<any>`

Converts the array to a plain JSON object.

---

##### Example

```JavaScript
import Cannery from 'cannery';

class Monkey extends Cannery.Root {

    getFields () {
        return {
            favorite_numbers: this.describe(Cannery.Types.ArrayType, Cannery.Types.NumberType)
        };
    }

}

const monkey = new Monkey();

monkey.apply([1,2,3]);

monkey.get(0); // 1

monkey.add(4);

monkey.move(0, 1);

monkey.all(); // 2, 1, 3, 4

monkey.remove(0);

monkey.toJSON(); // [1, 3, 4]
```

**[⬆ back to top](#table-of-contents)**

### BooleanType

The BooleanType is a simple type, which means that it can only be accessed through an object instead of directly. BooleanTypes convert all values provided to `true` or `false`. The BooleanType accepts a value via the ObjectType `set(:boolean)` method or the `apply({ :boolean })` method and is accessible through the ObjectType's `get()` and `toJSON()` methods.

Every value that the BooleanType receives will be converted to a boolean, which means that setting `monkey.set('is_tame', 'true')` would result in `monkey.get('is_tame'); // true`.

##### Api

No public API. This is a simple type.

##### Example

```JavaScript
import Cannery from 'cannery';

class Monkey extends Cannery.Root {

    getFields () {
        return {
            is_tame: Cannery.Types.BooleanType
        };
    }

}

const monkey = new Monkey();

monkey.set('is_tame', true);

monkey.get('is_tame'); // true

monkey.apply({
    is_tame: false
});

monkey.toJSON(); // { is_tame: false }
```

**[⬆ back to top](#table-of-contents)**

### NumberType

The NumberType is a simple type, so it can only be accessed through an object, no directly. It accepts a value through the ObjectType `set(:number)` method or the `apply({ :key: {:number} })` method and is accessible through the ObjectType's `get()` and `toJSON()` methods.

Every non value that the NumberType receives that is not a `null` or `undefined` will be converted to a number. Setting `monkey.set('age', '5')` would result in `monkey.get('name'); // 5`.

##### Api

No public API. This is a simple type.

##### Example

```JavaScript
import Cannery from 'cannery';

class Monkey extends Cannery.Root {

    getFields () {
        return {
            age: Cannery.Types.NumberType
        };
    }

}

const monkey = new Monkey();

monkey.set('age', 5);

monkey.get('age'); // 5

monkey.apply({
    age: 10
});

monkey.toJSON(); // { age: 10 }
```

**[⬆ back to top](#table-of-contents)**

### ObjectType

The Cannery ObjectType is a wrapper around multiple simple types. Just like a plain JavaScript object has multiple keys that point to values, the ObjectType reveals simple types or even ArrayTypes or other ObjectTypes through getters and setters.

Where a normal JavaScript object might look like this:

```javascript
const monkey = {
	name: 'George',
	age: 5,
	skills: {
		climbing: true
	}
};
```

A Cannery ObjectType will be defined like this:

```javascript
{
	monkey: this.define(ObjectType, {
		name: StringType,
		skills: this.define(ObjectType, {
			climbing: BooleanType
		})
	}))
}
```

The ObjectType will probably be the most important type you will encounter in Cannery because it is used to compose every other type.

##### Api

`apply(data: Object): ObjectType`

Applies a JavaScript object to the ObjectType. The simple types inside the ObjectType will be be used to convert data types if needed.

```javascript
monkey.apply({
	name: 'George',
	age: 5,
	favoriteNumbers: [4,5,6],
	isHappy: true,
	skills: {
		climbing: true,
		speaking: false
	}
});
```

---

`get(key: string): any`

Gets a field's value by its key.

```javascript
monkey.get('name'); // 'George'
monkey.get('skills').get('climbing'); // true
```

---

`set(key: string, value: any): ObjectType`

Sets a field's value by its key.

```javascript
monkey.set('name', 'King King');
monkey.get('skills').set('climbing', false);
```

---

`toJSON(): Object`

Converts the ObjectType to a normal JavaScript object. This is used internally when data is being persisted to an outside data store, but it may also be useful for other things.

```javascript
monkey.toJSON(); // { ... }
```

---

`validate(key: ?string): any`

Validates the field matching the passed in key, or if no key is provided, it validates every field on the ObjectType. If there are any errors when we are validating all of the fields on the ObjectType, an object will be returned containing a list of all of the errors indexed by the field key.

```javascript
monkey.validate('name');

// or
monkey.validate(); // { 'name': 'Name is required' }
```

---

##### Example

```javascript
import Cannery from 'cannery';

const { ObjectType, StringType, BooleanType } = Cannery.Types;

class Zoo extends Cannery.Root {
	getFields () {
		return {
			monkey: this.define(ObjectType, {
				name: StringType,
				skills: this.define(ObjectType, {
					climbing: BooleanType
				})
			}))
		};
	}
}

const zoo = new Zoo();
const monkey = zoo.get('monkey');

monkey.apply({
	name: 'George',
	skills: {
		climbing: true
	}
});

console.log(monkey.toJSON());
// { name: 'George', skills: { climbing: true } }

console.log(monkey.get('name')); // George
console.log(monkey.get('skills').get('climbing')); // true

monkey.set('name', 'King King');
console.log(monkey.get('name')); // King Kong
```

**[⬆ back to top](#table-of-contents)**

### StringType

The StringType is a simple type, which means that it can only be accessed through an object. It accepts a value via the ObjectType `set(:string)` method or the `apply({ :key: :string })` method and is accessible through the ObjectType's `get()` and `toJSON()` methods.

Every non-falsey value that the StringType receives will be converted to a string, which means that setting `monkey.set('name', 123)` would result in `monkey.get('name'); // '123'`.

##### Api

No public API. This is a simple type.

##### Example

```JavaScript
import Cannery from 'cannery';

class Monkey extends Cannery.Root {

    getFields () {
        return {
            name: Cannery.Types.StringType
        };
    }

}

const monkey = new Monkey();

monkey.set('name', 'George');

monkey.get('name'); // 'George'

monkey.apply({
    name: 'Donkey Kong'
});

monkey.toJSON(); // { name: 'Donkey Kong' }
```

**[⬆ back to top](#table-of-contents)**
