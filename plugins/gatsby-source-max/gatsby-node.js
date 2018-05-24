"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fetch = require("./fetch");
var normalize = require("./normalize");

var typePrefix = "wordpress__";
var refactoredEntityTypes = {
  post: typePrefix + "POST",
  page: typePrefix + "PAGE",
  tag: typePrefix + "TAG",
  category: typePrefix + "CATEGORY"

  /* If true, will output many console logs. */
};var _verbose = void 0;
var _siteURL = void 0;
var _useACF = true;
var _hostingWPCOM = void 0;
var _auth = void 0;
var _perPage = void 0;
var _concurrentRequests = void 0;
var _excludedRoutes = void 0;

exports.sourceNodes = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref2, _ref3) {
    var boundActionCreators = _ref2.boundActionCreators,
        getNode = _ref2.getNode,
        store = _ref2.store,
        cache = _ref2.cache,
        createNodeId = _ref2.createNodeId;
    var baseUrl = _ref3.baseUrl,
        protocol = _ref3.protocol,
        hostingWPCOM = _ref3.hostingWPCOM,
        _ref3$useACF = _ref3.useACF,
        useACF = _ref3$useACF === undefined ? true : _ref3$useACF,
        _ref3$auth = _ref3.auth,
        auth = _ref3$auth === undefined ? {} : _ref3$auth,
        verboseOutput = _ref3.verboseOutput,
        _ref3$perPage = _ref3.perPage,
        perPage = _ref3$perPage === undefined ? 100 : _ref3$perPage,
        _ref3$searchAndReplac = _ref3.searchAndReplaceContentUrls,
        searchAndReplaceContentUrls = _ref3$searchAndReplac === undefined ? {} : _ref3$searchAndReplac,
        _ref3$concurrentReque = _ref3.concurrentRequests,
        concurrentRequests = _ref3$concurrentReque === undefined ? 10 : _ref3$concurrentReque,
        _ref3$excludedRoutes = _ref3.excludedRoutes,
        excludedRoutes = _ref3$excludedRoutes === undefined ? [] : _ref3$excludedRoutes;
    var createNode, touchNode, entities;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            createNode = boundActionCreators.createNode, touchNode = boundActionCreators.touchNode;

            _verbose = verboseOutput;
            _siteURL = protocol + "://" + baseUrl;
            _useACF = useACF;
            _hostingWPCOM = hostingWPCOM;
            _auth = auth;
            _perPage = perPage;
            _concurrentRequests = concurrentRequests;
            _excludedRoutes = excludedRoutes;

            _context.next = 11;
            return fetch({
              baseUrl: baseUrl,
              _verbose: _verbose,
              _siteURL: _siteURL,
              _useACF: _useACF,
              _hostingWPCOM: _hostingWPCOM,
              _auth: _auth,
              _perPage: _perPage,
              _concurrentRequests: _concurrentRequests,
              _excludedRoutes: _excludedRoutes,
              typePrefix: typePrefix,
              refactoredEntityTypes: refactoredEntityTypes
            });

          case 11:
            entities = _context.sent;


            // Normalize data & create nodes

            // Remove ACF key if it's not an object
            entities = normalize.normalizeACF(entities);

            // Creates entities from object collections of entities
            entities = normalize.normalizeEntities(entities);

            // Standardizes ids & cleans keys
            entities = normalize.standardizeKeys(entities);

            // Converts to use only GMT dates
            entities = normalize.standardizeDates(entities);

            // Lifts all "rendered" fields to top-level.
            entities = normalize.liftRenderedField(entities);

            // Exclude entities of unknown shape
            entities = normalize.excludeUnknownEntities(entities);

            // Creates Gatsby IDs for each entity
            entities = normalize.createGatsbyIds(createNodeId, entities);

            // Creates links between authors and user entities
            entities = normalize.mapAuthorsToUsers(entities);

            // Creates links between posts and tags/categories.
            entities = normalize.mapPostsToTagsCategories(entities);

            // Creates links between tags/categories and taxonomies.
            entities = normalize.mapTagsCategoriesToTaxonomies(entities);

            // Creates links from entities to media nodes
            entities = normalize.mapEntitiesToMedia(entities);

            // Downloads media files and removes "sizes" data as useless in Gatsby context.
            _context.next = 25;
            return normalize.downloadMediaFiles({
              entities: entities,
              store: store,
              cache: cache,
              createNode: createNode,
              touchNode: touchNode,
              _auth: _auth
            });

          case 25:
            entities = _context.sent;


            // Creates links between elements and parent element.
            entities = normalize.mapElementsToParent(entities);

            // Search and replace Content Urls
            entities = normalize.searchReplaceContentUrls({
              entities: entities,
              searchAndReplaceContentUrls: searchAndReplaceContentUrls
            });

            // creates nodes for each entry
            normalize.createNodesFromEntities({ entities: entities, createNode: createNode });

            return _context.abrupt("return");

          case 30:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();