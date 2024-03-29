const slash = require(`slash`);
const path = require(`path`);
const fs = require(`fs-extra`);
const mime = require(`mime`);
const prettyBytes = require(`pretty-bytes`);

const md5File = require(`bluebird`).promisify(require(`md5-file`));
const crypto = require(`crypto`);

const createId = path => {
	const slashed = slash(path);
	return `${slashed} absPath of file`;
};

exports.createId = createId;

exports.createFileNode = async (pathToFile, pluginOptions = {}) => {
	const slashed = slash(pathToFile);
	const parsedSlashed = path.parse(slashed);
	const slashedFile = {
		...parsedSlashed,
		absolutePath: slashed,
		// Useful for limiting graphql query with certain parent directory
		relativeDirectory: path.relative(
			pluginOptions.path || process.cwd(),
			parsedSlashed.dir
		)
	};

	const stats = await fs.stat(slashedFile.absolutePath);
	let internal;
	if (stats.isDirectory()) {
		const contentDigest = crypto
			.createHash(`md5`)
			.update(
				JSON.stringify({
					stats: stats,
					absolutePath: slashedFile.absolutePath
				})
			)
			.digest(`hex`);
		internal = {
			contentDigest,
			type: `Directory`,
			description: `Directory "${path.relative(process.cwd(), slashed)}"`
		};
	} else {
		const contentDigest = await md5File(slashedFile.absolutePath);
		internal = {
			contentDigest,
			mediaType: mime.lookup(slashedFile.ext),
			type: `File`,
			description: `File "${path.relative(process.cwd(), slashed)}"`
		};
	}

	// Console.log('createFileNode:stat', slashedFile.absolutePath)
	// Stringify date objects.
	return JSON.parse(
		JSON.stringify({
			// Don't actually make the File id the absolute path as otherwise
			// people will use the id for that and ids shouldn't be treated as
			// useful information.
			id: createId(pathToFile),
			children: [],
			parent: `___SOURCE___`,
			internal,
			sourceInstanceName: pluginOptions.name || `__PROGRAMATTIC__`,
			absolutePath: slashedFile.absolutePath,
			relativePath: slash(
				path.relative(
					pluginOptions.path || process.cwd(),
					slashedFile.absolutePath
				)
			),
			extension: slashedFile.ext.slice(1).toLowerCase(),
			size: stats.size,
			prettySize: prettyBytes(stats.size),
			modifiedTime: stats.mtime,
			accessTime: stats.atime,
			changeTime: stats.ctime,
			birthTime: stats.birthtime,
			...slashedFile,
			...stats
		})
	);
};
