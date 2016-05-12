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

##### Api

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

##### Example
