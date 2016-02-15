function getType (Type) {

    if (Type === String) {
        return 'string';
    }

    if (Type === Number) {
        return 'number';
    }

    if (Type === Date) {
        return 'date';
    }

    if (Type === Boolean) {
        return 'boolean';
    }

    if (Type instanceof Array) {
        return 'array';
    }

    if (typeof Type === 'object') {
        return 'object';
    }

}

export default getType;
