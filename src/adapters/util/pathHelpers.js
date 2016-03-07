// @flow
'use stict';

function expandPath (arr: Array<Object>) : Array<String> {
    let expandedPath = [];

    arr.forEach((item) => {
        if (!item.id) {
            throw new Error(`Cannot expand path. ${item.key} has no ID`);
        }

        expandedPath.push(item.key);
        expandedPath.push(item.id);
    });

    return expandedPath;
}

function oneWithID (arr: Array<Object>, options: Object) : Array<String> {
    return expandPath(arr);
}

function oneWithoutID (arr: Array<Object>, options: Object) : Array<String> {
    const singularKey = options.enableSingular ? 'keySingular' : 'key';
    let path = expandPath(arr.slice(0, -1));
    return path.concat(arr[arr.length - 1][singularKey]);
}

function many (arr: Array<Object>, options: Object) : Array<String>  {
    let path = expandPath(arr.slice(0, -1));
    return path.concat(arr[arr.length - 1].key);
}

module.exports = {
    oneWithID,
    oneWithoutID,
    many
};
