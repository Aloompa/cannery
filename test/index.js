const path = require('path');

require('questy')({
    rootPath: path.resolve(__dirname, '../examples')
});

require('questy')({
    rootPath: path.resolve(__dirname, '../src')
});
