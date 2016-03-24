'use strict';
const libs = require('./lib')();
const main = require('./main');

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    document.getElementById('sigarea').appendChild(canvas);
    main.init(canvas);
});
