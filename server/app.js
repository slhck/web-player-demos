const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const locals = require('./locals');

const app = express();

app.use(express.static('dist'));
app.use(favicon(path.resolve(__dirname, '../src', 'favicon.ico')));
app.use(locals);

app.set('strict routing');
app.set('view engine', 'ejs');
app.set('view options', {
	async: true
});
app.set('views', path.resolve(__dirname, '..', 'demos'));

module.exports = app;
