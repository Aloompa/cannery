# Event Listeners

Every root, model and field type in Cannery has event listeners on it. These can be subscribed to either on the `getFields()` model definition or as methods that are available once the model is instantiated.

### In the fields definition

```javascript
class Monkey extends Cannery.Model {

    getFields () {
        return {
            name: this.define(StringType, {
                on: {
                    userChange: function (name) {
                        console.log(`We shall now call you ${name}`);
                    }
                }
            })
        }
    }

}
```

### On an instantiated model

```javascript
monkey.on('userChange', () => {
    // do something...
});
```
