"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var slash = require("slash");
var path = require("path");
var fs = require("fs-extra");
var mime = require("mime");
var prettyBytes = require("pretty-bytes");

var md5File = require("bluebird").promisify(require("md5-file"));
var crypto = require("crypto");

var createId = function createId(path) {
	var slashed = slash(path);
	return slashed + " absPath of file";
};

exports.createId = createId;

exports.createFileNode = function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(pathToFile) {
		var pluginOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		var slashed, parsedSlashed, slashedFile, stats, internal, contentDigest, _contentDigest;

		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						slashed = slash(pathToFile);
						parsedSlashed = path.parse(slashed);
						slashedFile = _extends({}, parsedSlashed, {
							absolutePath: slashed,
							// Useful for limiting graphql query with certain parent directory
							relativeDirectory: path.relative(pluginOptions.path || process.cwd(), parsedSlashed.dir)
						});
						_context.next = 5;
						return fs.stat(slashedFile.absolutePath);

					case 5:
						stats = _context.sent;
						internal = void 0;

						if (!stats.isDirectory()) {
							_context.next = 12;
							break;
						}

						contentDigest = crypto.createHash("md5").update(JSON.stringify({
							stats: stats,
							absolutePath: slashedFile.absolutePath
						})).digest("hex");

						internal = {
							contentDigest: contentDigest,
							type: "Directory",
							description: "Directory \"" + path.relative(process.cwd(), slashed) + "\""
						};
						_context.next = 16;
						break;

					case 12:
						_context.next = 14;
						return md5File(slashedFile.absolutePath);

					case 14:
						_contentDigest = _context.sent;

						internal = {
							contentDigest: _contentDigest,
							mediaType: mime.lookup(slashedFile.ext),
							type: "File",
							description: "File \"" + path.relative(process.cwd(), slashed) + "\""
						};

					case 16:
						return _context.abrupt("return", JSON.parse(JSON.stringify(_extends({
							// Don't actually make the File id the absolute path as otherwise
							// people will use the id for that and ids shouldn't be treated as
							// useful information.
							id: createId(pathToFile),
							children: [],
							parent: "___SOURCE___",
							internal: internal,
							sourceInstanceName: pluginOptions.name || "__PROGRAMATTIC__",
							absolutePath: slashedFile.absolutePath,
							relativePath: slash(path.relative(pluginOptions.path || process.cwd(), slashedFile.absolutePath)),
							extension: slashedFile.ext.slice(1).toLowerCase(),
							size: stats.size,
							prettySize: prettyBytes(stats.size),
							modifiedTime: stats.mtime,
							accessTime: stats.atime,
							changeTime: stats.ctime,
							birthTime: stats.birthtime
						}, slashedFile, stats))));

					case 17:
					case "end":
						return _context.stop();
				}
			}
		}, _callee, undefined);
	}));

	return function (_x) {
		return _ref.apply(this, arguments);
	};
}();