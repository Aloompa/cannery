'use strict';

require('babel-core/register');
const config = require('./_config');
let exhibitsArray = [];
let exhibitIds = [];

const Zoo = require('../examples/models/zoo');
const zoo = new Zoo();

console.time('cannery.applyWithoutEvent');

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

console.timeEnd('cannery.applyWithoutEvent');
