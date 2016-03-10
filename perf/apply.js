'use strict';

require('babel-core/register');
const config = require('./_config');
let exhibitsArray = [];
let exhibitIds = [];

const Zoo = require('../examples/models/zoo');
const zoo = new Zoo();

console.time('cannery.apply');

const onZooChange = zoo.on('change', () => {
    zoo.off('change', onZooChange);
    console.timeEnd('cannery.apply');
});

for (let i = 0; i < config.records; i++) {
    exhibitsArray.push({
        id: String(i + 1),
        name: `Exhibit ${i}`
    });

    exhibitIds.push(String(i + 1));

    zoo.apply({
        exhibitIds: exhibitIds,
        exhibits: exhibitsArray
    });
}
