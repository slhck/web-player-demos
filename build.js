#!/usr/bin/env node

const ejs = require('ejs');
const fs = require('fs-extra');
const path = require('path');

const partialsPath = path.resolve(__dirname, 'partials');
const demosPath = path.join(__dirname, 'demos');
const dist = path.join(__dirname, 'dist');

const ejsOptions = {
	rmWhitespace: false
};

const include = (partial, data = null) => `<%- include("${partialsPath}/${partial}"${data ? `, ${data}` : ''}); %>`;

const getFile = (dir, name, exts = []) => {
	if (!exts.length) {
		return null;
	}

	const ext = exts.pop();
	try {
		return fs.readFileSync(path.format({ name, dir, ext }), 'utf8');
	} catch (err) {
		if (err.code === 'ENOENT') {
			return getFile(dir, name, exts);
		}
	}
}

const demoSlugs = fs.readdirSync(demosPath);

const configs = [];
demoSlugs.forEach(slug => {
	const srcDir = path.join(demosPath, slug);
	const destDir = path.join(dist, slug);
	const doc = getFile(srcDir, 'index', ['.html', '.ejs']);
	const scriptContent = getFile(srcDir, 'demo', ['.js']);
	const styleContent = getFile(srcDir, 'style', ['.css']);

	const content = [
		include('head'),
		include('license'),
		doc,
		include('scriptview'),
		include('footer')
	].join('\n');

	const config = {
		...JSON.parse(getFile(srcDir, 'config', ['.json'])),
		scriptContent,
		styleContent,
		slug,
		partialsPath
	}


	const output = ejs.render(content, config, ejsOptions);

	configs.push(config);

	const fileDest = path.format({
		dir: destDir,
		ext: '.html',
		name: 'index'
	});

	fs.mkdirp(destDir, function(err) {
		if (err) {
			// console.log(err);
			return;
		}

		fs.writeFileSync(fileDest, output);
		// console.log(`${fileDest} written.`);
	});
});

const indexTemplate = fs.readFileSync(`${partialsPath}/index.ejs`, 'utf8');

const index = ejs.render(indexTemplate, {
	demoSlugs,
	partialsPath,
	configs
});

fs.writeFileSync(path.format({
	dir: dist,
	ext: '.html',
	name: 'index'
}), index);
