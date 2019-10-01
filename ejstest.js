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

demoSlugs.forEach(slug => {
	const srcDir = path.join(demosPath, slug);
	const destDir = path.join(dist, slug);
	const doc = getFile(srcDir, 'index', ['.html', '.ejs']);
	const scriptContent = getFile(srcDir, 'demo', ['.js']);
	const styleContent = getFile(srcDir, 'style', ['.css']);
	const config = JSON.parse(getFile(srcDir, 'config', ['.json']));

	const content = [
		include('head'),
		include('license'),
		doc,
		include('scriptview'),
		include('footer')
	].join('');

	const output = ejs.render(content, {
		scriptContent,
		styleContent,
		slug,
		partialsPath,
		...config
	}, ejsOptions);

	const fileDest = path.format({
		dir: destDir,
		ext: '.html',
		name: 'index'
	});

	fs.mkdirp(destDir, function(err) {
		if (err) {
			console.log(err);
			return;
		}

		fs.writeFileSync(fileDest, output);
		console.log(`${fileDest} written.`);
	});
});
