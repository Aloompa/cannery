module.exports = (Cannery) => {
    return (typeName, method) => {
        Cannery.Type[typeName] = method;
    };
};
