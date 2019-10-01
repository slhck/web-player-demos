const fs = require('fs');
const { promisify } = require('util');
const express = require('express');
const app = require('./app');
const readFile = promisify(fs.readFile);

const router = express.Router({ strict: app.get('strict routing') });

router.get('/:demoslug', async (req, res, next) => {
	const { demoslug = '' } = req.params;
	try {
		const scriptContent = await readFile(path.resolve(viewsDir, demoslug, 'js', 'main.js'));
		res.locals = { ...res.locals, scriptContent };
		res.render(`../demos/${demoslug}/index`);
	} catch (err) {
		console.log(err);
		next(err);
	}
});

module.exports = router;
