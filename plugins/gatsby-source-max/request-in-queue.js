"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var handleQueue = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(task, cb) {
    var response;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return request(task);

          case 3:
            response = _context.sent;

            cb(null, response);
            _context.next = 10;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);

            cb(_context.t0);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 7]]);
  }));

  return function handleQueue(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * @typedef {Options}
 * @type {Object}
 * @see For a detailed descriptions of the options,
 *      see {@link https://www.npmjs.com/package/better-queue#full-documentation|better-queue on Github}
 */

/**
 * Run a series of requests tasks in a queue for better flow control
 *
 * @param  {Object[]} tasks  An array of Axios formatted request objects
 * @param  {Options}  opts   Options that will be given to better-queue
 * @return {Promise}         Resolves with the accumulated values from the tasks
 */


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Queue = require("better-queue");
var Promise = require("bluebird");
var request = require("axios");

var _defaults = {
  id: "url"

  /**
   * [handleQueue description]
   * @param  {[type]}   task [description]
   * @param  {Function} cb   [description]
   * @return {[type]}        [description]
   */
};module.exports = function requestInQueue(tasks) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return new Promise(function (res, rej) {
    var q = new Queue(handleQueue, _extends({}, _defaults, opts));

    var taskMap = new Map(tasks.map(function (t) {
      q.push(t);
      return [t.url, null];
    }));

    q.on("task_failed", function (id, err) {
      rej(id + " failed with err: " + err);
      q.destroy();
    });

    q.on("task_finish", function (id, response) {
      taskMap.set(id, response);
    });

    q.on("drain", function () {
      return res(Array.from(taskMap.values()));
    });
  });
};