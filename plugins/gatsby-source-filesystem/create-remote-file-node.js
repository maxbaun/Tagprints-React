'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * @callback {Queue~queueCallback}
 * @param {*} error
 * @param {*} result
 */

/**
 * pushToQueue
 * --
 * Handle tasks that are pushed in to the Queue
 *
 *
 * @param  {CreateRemoteFileNodePayload}          task
 * @param  {Queue~queueCallback}  cb
 * @return {Promise<null>}
 */
var pushToQueue = function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(task, cb) {
		var node;
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.prev = 0;
						_context.next = 3;
						return processRemoteNode(task);

					case 3:
						node = _context.sent;
						return _context.abrupt('return', cb(null, node));

					case 7:
						_context.prev = 7;
						_context.t0 = _context['catch'](0);
						return _context.abrupt('return', cb(null, _context.t0));

					case 10:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, this, [[0, 7]]);
	}));

	return function pushToQueue(_x, _x2) {
		return _ref.apply(this, arguments);
	};
}();

/******************
 * Core Functions *
 ******************/

/**
 * requestRemoteNode
 * --
 * Download the requested file
 *
 * @param  {String}   url
 * @param  {Headers}  headers
 * @param  {String}   tmpFilename
 * @param  {String}   filename
 * @return {Promise<Object>}  Resolves with the [http Result Object]{@link https://nodejs.org/api/http.html#http_class_http_serverresponse}
 */


var processRemoteNode = function () {
	var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref3) {
		var url = _ref3.url,
		    store = _ref3.store,
		    cache = _ref3.cache,
		    createNode = _ref3.createNode,
		    _ref3$auth = _ref3.auth,
		    auth = _ref3$auth === undefined ? {} : _ref3$auth;
		var programDir, cachedHeaders, headers, digest, ext, tmpFilename, filename, response, fileNode;
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						// Ensure our cache directory exists.
						programDir = store.getState().program.directory;
						_context2.next = 3;
						return fs.ensureDir(path.join(programDir, CACHE_DIR, FS_PLUGIN_DIR));

					case 3:
						_context2.next = 5;
						return cache.get(cacheId(url));

					case 5:
						cachedHeaders = _context2.sent;
						headers = {};

						// Add htaccess authentication if passed in. This isn't particularly
						// extensible. We should define a proper API that we validate.

						if (auth && auth.htaccess_pass && auth.htaccess_user) {
							headers.auth = auth.htaccess_user + ':' + auth.htaccess_pass;
						}

						if (cachedHeaders && cachedHeaders.etag) {
							headers['If-None-Match'] = cachedHeaders.etag;
						}

						// Create the temp and permanent file names for the url.
						digest = createHash(url);
						ext = path.parse(url).ext;
						tmpFilename = createFilePath(programDir, 'tmp-' + digest, ext);
						filename = createFilePath(programDir, digest, ext);

						// Fetch the file.

						_context2.prev = 13;
						_context2.next = 16;
						return requestRemoteNode(url, headers, tmpFilename, filename);

					case 16:
						response = _context2.sent;

						count++;

						// Save the response headers for future requests.
						cache.set(cacheId(url), response.headers);

						// If the status code is 200, move the piped temp file to the real name.

						if (!(response.statusCode === 200)) {
							_context2.next = 30;
							break;
						}

						_context2.next = 22;
						return fs.move(tmpFilename, filename, { overwrite: true });

					case 22:
						console.log('=============');
						console.log('count', count);
						console.log('url', url);
						console.log('download completer', response.statusCode);
						console.log(tmpFilename);
						console.log(filename);
						// Else if 304, remove the empty response.
						_context2.next = 32;
						break;

					case 30:
						_context2.next = 32;
						return fs.remove(tmpFilename);

					case 32:
						_context2.next = 34;
						return createFileNode(filename, {});

					case 34:
						fileNode = _context2.sent;

						fileNode.internal.description = 'File "' + url + '"';
						// Override the default plugin as gatsby-source-filesystem needs to
						// be the owner of File nodes or there'll be conflicts if any other
						// File nodes are created through normal usages of
						// gatsby-source-filesystem.
						createNode(fileNode, { name: 'gatsby-source-filesystem' });

						return _context2.abrupt('return', fileNode);

					case 40:
						_context2.prev = 40;
						_context2.t0 = _context2['catch'](13);

					case 42:
						return _context2.abrupt('return', null);

					case 43:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, this, [[13, 40]]);
	}));

	return function processRemoteNode(_x3) {
		return _ref2.apply(this, arguments);
	};
}();

/**
 * Index of promises resolving to File node from remote url
 */


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fs = require('fs-extra');
var got = require('got');
var crypto = require('crypto');
var path = require('path');

var _require = require('valid-url'),
    isWebUri = _require.isWebUri;

var Queue = require('better-queue');

var _require2 = require('./create-file-node'),
    createFileNode = _require2.createFileNode;

var cacheId = function cacheId(url) {
	return 'create-remote-file-node-' + url;
};

/********************
 * Type Definitions *
 ********************/

/**
 * @typedef {Redux}
 * @see [Redux Docs]{@link https://redux.js.org/api-reference}
 */

/**
 * @typedef {GatsbyCache}
 * @see gatsby/packages/gatsby/utils/cache.js
 */

/**
 * @typedef {Auth}
 * @type {Object}
 * @property {String} htaccess_pass
 * @property {String} htaccess_user
 */

/**
 * @typedef {CreateRemoteFileNodePayload}
 * @typedef {Object}
 * @description Create Remote File Node Payload
 *
 * @param  {String} options.url
 * @param  {Redux} options.store
 * @param  {GatsbyCache} options.cache
 * @param  {Function} options.createNode
 * @param  {Auth} [options.auth]
 */

/*********
 * utils *
 *********/

/**
 * createHash
 * --
 *
 * Create an md5 hash of the given str
 * @param  {Stringq} str
 * @return {String}
 */
var createHash = function createHash(str) {
	return crypto.createHash('md5').update(str).digest('hex');
};

var CACHE_DIR = '.cache';
var FS_PLUGIN_DIR = 'gatsby-source-filesystem';

/**
 * CreateFilePath
 * --
 *
 * @param  {String} directory
 * @param  {String} filename
 * @param  {String} url
 * @return {String}
 */
var createFilePath = function createFilePath(directory, filename, ext) {
	return path.join(directory, CACHE_DIR, FS_PLUGIN_DIR, '' + filename + ext);
};

/********************
 * Queue Management *
 ********************/

/**
 * Queue
 * Use the task's url as the id
 * When pushing a task with a similar id, prefer the original task
 * as it's already in the processing cache
 */
var queue = new Queue(pushToQueue, {
	id: 'url',
	merge: function merge(old, _, cb) {
		return cb(old);
	},
	concurrent: 10
});var requestRemoteNode = function requestRemoteNode(url, headers, tmpFilename, filename) {
	return new Promise(function (resolve, reject) {
		var responseStream = got.stream(url, _extends({}, headers, { timeout: 30000 }));
		var fsWriteStream = fs.createWriteStream(tmpFilename);
		responseStream.pipe(fsWriteStream);
		responseStream.on('downloadProgress', function (pro) {
			return console.log(pro);
		});

		// If there's a 400/500 response or other error.
		responseStream.on('error', function (error, body, response) {
			fs.removeSync(tmpFilename);
			reject({ error: error, body: body, response: response });
		});

		responseStream.on('response', function (response) {
			fsWriteStream.on('finish', function () {
				resolve(response);
			});
		});
	});
};

/**
 * ProcessRemoteNode
 * --
 * Request the remote file and return the fileNode
 *
 * @param {CreateRemoteFileNodePayload} options
 * @return {Promise<Object>} Resolves with the fileNode
 */
var count = 0;
var processingCache = {};
/**
 * PushTask
 * --
 * pushes a task in to the Queue and the processing cache
 *
 * Promisfy a task in queue
 * @param {CreateRemoteFileNodePayload} task
 * @return {Promise<Object>}
 */
var pushTask = function pushTask(task) {
	return new Promise(function (resolve, reject) {
		queue.push(task).on('finish', function (task) {
			resolve(task);
		}).on('failed', function () {
			resolve();
		});
	});
};

/***************
 * Entry Point *
 ***************/

/**
 * createRemoteFileNode
 * --
 *
 * Download a remote file
 * First checks cache to ensure duplicate requests aren't processed
 * Then pushes to a queue
 *
 * @param {CreateRemoteFileNodePayload} options
 * @return {Promise<Object>}                  Returns the created node
 */
module.exports = function (_ref4) {
	var url = _ref4.url,
	    store = _ref4.store,
	    cache = _ref4.cache,
	    createNode = _ref4.createNode,
	    _ref4$auth = _ref4.auth,
	    auth = _ref4$auth === undefined ? {} : _ref4$auth;

	// Check if we already requested node for this remote file
	// and return stored promise if we did.
	if (processingCache[url]) {
		return processingCache[url];
	}

	if (!url || isWebUri(url) === undefined) {
		// Should we resolve here, or reject?
		// Technically, it's invalid input
		return Promise.resolve();
	}

	return processingCache[url] = pushTask({
		url: url,
		store: store,
		cache: cache,
		createNode: createNode,
		auth: auth
	});
};