const express = require('express');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const favicon = require('serve-favicon');
const { promisify } = require('util');
const appLocals = require('./locals');

const PORT = process.env.EXPRESS_PORT || 3000;

const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);

const app = express();

const viewsDir = path.resolve(__dirname, '../demos');

app.set('strict routing');
app.set('view engine', 'ejs');
app.set('views', viewsDir);

app.use(express.static('dist'));
app.use(favicon(path.resolve(__dirname, '../src', 'favicon.ico')));

app.locals = { ...app.locals, ...appLocals };

const router = express.Router({ strict: app.get('strict routing') });

router.get('/:slug', async (req, res, next) => {
	const { slug = '' } = req.params;
	const base = path.resolve(viewsDir, slug);
	let scripts = [];
	try {
		readdir(path.join(base, 'js'), async (err, files) => {
			if (err) throw err;
			files.filter(f => f !== 'main.js').forEach((f, i) => {
				scripts.push(f);
			});
		});

		res.locals.scriptContent = await readFile(path.resolve(viewsDir, `${slug}/js/main.js`));
		res.locals.slug = slug;
		res.locals.scripts = scripts;
		res.send(ejs.render(`<%- include("${res.locals.partialsPath}/head") %>`));
	} catch (err) {
		console.log(err);
		next(err);
	}
});

// router.use(async (err, req, res, next) => res.status(404).send('Not Found'));

app.use(router);

app.listen(PORT);
console.log(`Server listening on port ${PORT}`);

