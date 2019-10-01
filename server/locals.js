const path = require('path');
const sprites = require('./sprites');

const partialsPath = path.resolve(__dirname, '../partials');

const locals = {
	partialsPath,
	sprites
};


module.exports = locals;
