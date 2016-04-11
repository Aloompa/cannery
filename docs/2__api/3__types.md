# Cannery Types

Every Cannery Model and Root requires a `getFields()` method which returns an object that composes multiple Cannery Types. These types become the fields for your Cannery model and are accessible via getters and setters. Every type has a `get()`, `set()`, `toJSON()` and `apply()` method by default, but some types provide additional methods as well.

## Table Of Contents
* [AnyType](#anytype)
* [ArrayType](#arraytype)
* [BooleanType](#booleantype)
* [HasMany](#hasmany)
* [HasOne](#hasone)
* [NumberType](#numbertype)
* [ObjectType](#objecttype)
* [OwnsMany](#ownsmany)
* [OwnsOne](#ownsone)
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

monkey.get('name'); // George

monkey.apply({
    name: 'Donkey Kong'
});

monkey.toJSON(); // { name: 'Donkey Kong' }
```

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

### HasMany

### HasOne

### NumberType

### ObjectType

### OwnsMany

### OwnsOne

### StringType

The StringType is a simple type, which means that it can only be accessed through an object. It accepts a value via the ObjectType `set(:string)` method or the `apply({ :string })` method and is accessible through the ObjectType's `get()` and `toJSON()` methods.

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

monkey.get('name'); // George

monkey.apply({
    name: 'Donkey Kong'
});

monkey.toJSON(); // { name: 'Donkey Kong' }
```
