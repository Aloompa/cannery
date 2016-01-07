module.exports = (Cannery) => {
    return (typeName, method) => {
        Cannery.Types[typeName] = method;
        return Cannery;
    };
};
