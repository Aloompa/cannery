# Cannery Types

Every Cannery Model and Root requires a `getFields()` method which returns an object that composes multiple Cannery Types. These types become the fields for your Cannery model and are accessible via getters and setters. Every type has a `get()`, `set()`, `toJSON()` and `apply()` method by default, but some types provide additional methods as well.

##### Types
- AnyType
- ArrayType
- BooleanType
- HasMany
- HasOne
- NumberType
- ObjectType
- OwnsMany
- OwnsOne
- StringType

### AnyType

The AnyType is the most basic type in Cannery. It makes no assumptions about the structure of your data. All of the types provided with the Cannery library extend AnyType. If possible, avoid using this type directly and instead use a type such as the StringType or NumberType for more control over the format of your data.

AnyType is a basic type, which means that it is only accessible through an ObjectType.

##### Api

No public API. This is a simple type.

##### Example

```
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

### BooleanType

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

```
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
