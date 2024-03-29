'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var crypto = require('crypto');
var deepMapKeys = require('deep-map-keys');
var _ = require('lodash');

var _require = require('../gatsby-source-filesystem'),
    createRemoteFileNode = _require.createRemoteFileNode;

var colorized = require('./output-color');
var conflictFieldPrefix = 'wordpress_';
// restrictedNodeFields from here https://www.gatsbyjs.org/docs/node-interface/
var restrictedNodeFields = ['id', 'children', 'parent', 'fields', 'internal'];

/**
 * Encrypts a String using md5 hash of hexadecimal digest.
 *
 * @param {any} str
 */
var digest = function digest(str) {
  return crypto.createHash('md5').update(str).digest('hex');
};

/**
 * Validate the GraphQL naming convetions & protect specific fields.
 *
 * @param {any} key
 * @returns the valid name
 */
function getValidKey(_ref) {
  var key = _ref.key,
      _ref$verbose = _ref.verbose,
      verbose = _ref$verbose === undefined ? false : _ref$verbose;

  var nkey = String(key);
  var NAME_RX = /^[_a-zA-Z][_a-zA-Z0-9]*$/;
  var changed = false;
  // Replace invalid characters
  if (!NAME_RX.test(nkey)) {
    changed = true;
    nkey = nkey.replace(/-|__|:|\.|\s/g, '_');
  }
  // Prefix if first character isn't a letter.
  if (!NAME_RX.test(nkey.slice(0, 1))) {
    changed = true;
    nkey = '' + conflictFieldPrefix + nkey;
  }
  if (restrictedNodeFields.includes(nkey)) {
    changed = true;
    nkey = ('' + conflictFieldPrefix + nkey).replace(/-|__|:|\.|\s/g, '_');
  }
  if (changed && verbose) console.log(colorized.out('Object with key "' + key + '" breaks GraphQL naming convention. Renamed to "' + nkey + '"', colorized.color.Font.FgRed));

  return nkey;
}

exports.getValidKey = getValidKey;

// Remove the ACF key from the response when it's not an object
var normalizeACF = function normalizeACF(entities) {
  return entities.map(function (e) {
    if (!_.isPlainObject(e['acf'])) {
      delete e['acf'];
    }
    return e;
  });
};

exports.normalizeACF = normalizeACF;

// Create entities from the few the WordPress API returns as an object for presumably
// legacy reasons.
var normalizeEntities = function normalizeEntities(entities) {
  var mapType = function mapType(e) {
    return Object.keys(e).filter(function (key) {
      return key !== '__type';
    }).map(function (key) {
      return _extends({
        id: key
      }, e[key], {
        __type: e.__type
      });
    });
  };

  return entities.reduce(function (acc, e) {
    switch (e.__type) {
      case 'wordpress__wp_types':
        return acc.concat(mapType(e));
      case 'wordpress__wp_api_menus_menu_locations':
        return acc.concat(mapType(e));
      case 'wordpress__wp_statuses':
        return acc.concat(mapType(e));
      case 'wordpress__wp_taxonomies':
        return acc.concat(mapType(e));
      case 'wordpress__acf_options':
        return acc.concat(mapType(e));
      default:
        return acc.concat(e);
    }
  }, []);
};

exports.normalizeEntities = normalizeEntities;

// Standardize ids + make sure keys are valid.
exports.standardizeKeys = function (entities) {
  return entities.map(function (e) {
    return deepMapKeys(e, function (key) {
      return key === 'ID' ? getValidKey({ key: 'id' }) : getValidKey({ key: key });
    });
  });
};

// Standardize dates on ISO 8601 version.
exports.standardizeDates = function (entities) {
  return entities.map(function (e) {
    Object.keys(e).forEach(function (key) {
      if (e[key + '_gmt']) {
        e[key] = new Date(e[key + '_gmt'] + 'z').toJSON();
        delete e[key + '_gmt'];
      }
    });

    return e;
  });
};

// Lift "rendered" fields to top-level
exports.liftRenderedField = function (entities) {
  return entities.map(function (e) {
    Object.keys(e).forEach(function (key) {
      var value = e[key];
      if (_.isObject(value) && _.isString(value.rendered)) {
        e[key] = value.rendered;
      }
    });

    return e;
  });
};

// Exclude entities of unknown shape
exports.excludeUnknownEntities = function (entities) {
  return entities.filter(function (e) {
    return e.wordpress_id;
  });
}; // Excluding entities without ID

exports.createGatsbyIds = function (createNodeId, entities) {
  return entities.map(function (e) {
    e.id = createNodeId(e.__type + '-' + e.wordpress_id.toString());
    return e;
  });
};

// Build foreign reference map.
exports.mapTypes = function (entities) {
  var groups = _.groupBy(entities, function (e) {
    return e.__type;
  });
  for (var groupId in groups) {
    groups[groupId] = groups[groupId].map(function (e) {
      return {
        wordpress_id: e.wordpress_id,
        id: e.id
      };
    });
  }

  return groups;
};

exports.mapAuthorsToUsers = function (entities) {
  var users = entities.filter(function (e) {
    return e.__type === 'wordpress__wp_users';
  });
  return entities.map(function (e) {
    if (e.author) {
      // Find the user
      var user = users.find(function (u) {
        return u.wordpress_id === e.author;
      });
      if (user) {
        e.author___NODE = user.id;

        // Add a link to the user to the entity.
        if (!user.all_authored_entities___NODE) {
          user.all_authored_entities___NODE = [];
        }
        user.all_authored_entities___NODE.push(e.id);
        if (!user['authored_' + e.__type + '___NODE']) {
          user['authored_' + e.__type + '___NODE'] = [];
        }
        user['authored_' + e.__type + '___NODE'].push(e.id);

        delete e.author;
      }
    }
    return e;
  });
};

exports.mapPostsToTagsCategories = function (entities) {
  var tags = entities.filter(function (e) {
    return e.__type === 'wordpress__TAG';
  });
  var categories = entities.filter(function (e) {
    return e.__type === 'wordpress__CATEGORY';
  });

  return entities.map(function (e) {
    if (e.__type === 'wordpress__POST') {
      // Replace tags & categories with links to their nodes.
      if (e.tags.length) {
        e.tags___NODE = e.tags.map(function (t) {
          return tags.find(function (tObj) {
            return t === tObj.wordpress_id;
          }).id;
        });
        delete e.tags;
      }
      if (e.categories.length) {
        e.categories___NODE = e.categories.map(function (c) {
          return categories.find(function (cObj) {
            return c === cObj.wordpress_id;
          }).id;
        });
        delete e.categories;
      }
    }
    return e;
  });
};

// TODO generalize this for all taxonomy types.
exports.mapTagsCategoriesToTaxonomies = function (entities) {
  return entities.map(function (e) {
    // Where should api_menus stuff link to?
    if (e.taxonomy && e.__type !== 'wordpress__wp_api_menus_menus') {
      // Replace taxonomy with a link to the taxonomy node.
      e.taxonomy___NODE = entities.find(function (t) {
        return t.wordpress_id === e.taxonomy;
      }).id;
      delete e.taxonomy;
    }
    return e;
  });
};

exports.mapElementsToParent = function (entities) {
  return entities.map(function (e) {
    if (e.wordpress_parent) {
      // Create parent_element with a link to the parent node of type.
      var parentElement = entities.find(function (t) {
        return t.wordpress_id === e.wordpress_parent && t.__type === e.__type;
      });
      if (parentElement) {
        e.parent_element___NODE = parentElement.id;
      }
    }
    return e;
  });
};

exports.searchReplaceContentUrls = function (_ref2) {
  var entities = _ref2.entities,
      searchAndReplaceContentUrls = _ref2.searchAndReplaceContentUrls;

  if (!_.isPlainObject(searchAndReplaceContentUrls) || !_.has(searchAndReplaceContentUrls, 'sourceUrl') || !_.has(searchAndReplaceContentUrls, 'replacementUrl') || typeof searchAndReplaceContentUrls.sourceUrl !== 'string' || typeof searchAndReplaceContentUrls.replacementUrl !== 'string') {
    return entities;
  }

  var sourceUrl = searchAndReplaceContentUrls.sourceUrl,
      replacementUrl = searchAndReplaceContentUrls.replacementUrl;


  var _blacklist = ['_links', '__type'];

  var blacklistProperties = function blacklistProperties() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var blacklist = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    for (var i = 0; i < blacklist.length; i++) {
      delete obj[blacklist[i]];
    }

    return obj;
  };

  return entities.map(function (entity) {
    var original = Object.assign({}, entity);

    try {
      var whiteList = blacklistProperties(entity, _blacklist);
      var replaceable = JSON.stringify(whiteList);
      var replaced = replaceable.replace(new RegExp(sourceUrl, 'g'), replacementUrl);
      var parsed = JSON.parse(replaced);
    } catch (e) {
      console.log(colorized.out(e.message, colorized.color.Font.FgRed));
      return original;
    }

    return _.defaultsDeep(parsed, original);
  });
};

exports.mapEntitiesToMedia = function (entities) {
  var media = entities.filter(function (e) {
    return e.__type === 'wordpress__wp_media';
  });

  return entities.map(function (e) {
    // Map featured_media to its media node

    // Check if it's value of ACF Image field, that has 'Return value' set to
    // 'Image Object' ( https://www.advancedcustomfields.com/resources/image/ )
    var isPhotoObject = function isPhotoObject(field) {
      return _.isObject(field) && field.wordpress_id && field.url && field.width && field.height ? true : false;
    };

    var isURL = function isURL(value) {
      return _.isString(value) && value.startsWith('http');
    };
    var isMediaUrlAlreadyProcessed = function isMediaUrlAlreadyProcessed(key) {
      return key == 'source_url';
    };
    var isFeaturedMedia = function isFeaturedMedia(value, key) {
      return (_.isNumber(value) || _.isBoolean(value)) && key === 'featured_media';
    };
    // ACF Gallery and similarly shaped arrays
    var isArrayOfPhotoObject = function isArrayOfPhotoObject(field) {
      return _.isArray(field) && field.length > 0 && isPhotoObject(field[0]);
    };
    var getMediaItemID = function getMediaItemID(mediaItem) {
      return mediaItem ? mediaItem.id : null;
    };

    // Try to get media node from value:
    //  - special case - check if key is featured_media and value is photo ID
    //  - check if value is media url
    //  - check if value is ACF Image Object
    //  - check if value is ACF Gallery
    var getMediaFromValue = function getMediaFromValue(value, key) {
      if (isFeaturedMedia(value, key)) {
        return {
          mediaNodeID: _.isNumber(value) ? getMediaItemID(media.find(function (m) {
            return m.wordpress_id === value;
          })) : null,
          deleteField: true
        };
      } else if (isURL(value) && !isMediaUrlAlreadyProcessed(key)) {
        var mediaNodeID = getMediaItemID(media.find(function (m) {
          return m.source_url === value;
        }));
        return {
          mediaNodeID: mediaNodeID,
          deleteField: !!mediaNodeID
        };
      } else if (isPhotoObject(value)) {
        var _mediaNodeID = getMediaItemID(media.find(function (m) {
          return m.source_url === value.url;
        }));
        return {
          mediaNodeID: _mediaNodeID,
          deleteField: !!_mediaNodeID
        };
      } else if (isArrayOfPhotoObject(value)) {
        return {
          mediaNodeID: value.map(function (item) {
            return getMediaFromValue(item, key).mediaNodeID;
          }).filter(function (id) {
            return id !== null;
          }),
          deleteField: true
        };
      }
      return {
        mediaNodeID: null,
        deleteField: false
      };
    };

    var replaceFieldsInObject = function replaceFieldsInObject(object) {
      var deletedAllFields = true;
      _.each(object, function (value, key) {
        var _getMediaFromValue = getMediaFromValue(value, key),
            mediaNodeID = _getMediaFromValue.mediaNodeID,
            deleteField = _getMediaFromValue.deleteField;

        if (mediaNodeID) {
          object[key + '___NODE'] = mediaNodeID;
        }
        if (deleteField) {
          delete object[key];
          // We found photo node (even if it has no image),
          // We can end processing this path
          return;
        } else {
          deletedAllFields = false;
        }

        if (_.isArray(value)) {
          value.forEach(function (v) {
            return replaceFieldsInObject(v);
          });
        } else if (_.isObject(value)) {
          replaceFieldsInObject(value);
        }
      });

      // Deleting fields and replacing them with links to different nodes
      // can cause build errors if object will have only linked properites:
      // https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby/src/schema/infer-graphql-input-fields.js#L205
      // Hacky workaround:
      // Adding dummy field with concrete value (not link) fixes build
      if (deletedAllFields && object && _.isObject(object)) {
        object['dummy'] = true;
      }
    };
    replaceFieldsInObject(e);

    return e;
  });
};

var count = 0;
// Downloads media files and removes "sizes" data as useless in Gatsby context.
exports.downloadMediaFiles = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref4) {
    var entities = _ref4.entities,
        store = _ref4.store,
        cache = _ref4.cache,
        createNode = _ref4.createNode,
        touchNode = _ref4.touchNode,
        _auth = _ref4._auth;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt('return', Promise.all(entities.map(function () {
              var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(e) {
                var fileNodeID, mediaDataCacheKey, cacheMediaData, fileNode;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        fileNodeID = void 0;
                        // && e.mime_type !== 'image/gif'

                        if (!(e.__type === 'wordpress__wp_media')) {
                          _context.next = 24;
                          break;
                        }

                        mediaDataCacheKey = 'wordpress-media-' + e.wordpress_id;
                        _context.next = 5;
                        return cache.get(mediaDataCacheKey);

                      case 5:
                        cacheMediaData = _context.sent;


                        // If we have cached media data and it wasn't modified, reuse
                        // previously created file node to not try to redownload
                        if (cacheMediaData && e.modified === cacheMediaData.modified) {
                          fileNodeID = cacheMediaData.fileNodeID;
                          touchNode(cacheMediaData.fileNodeID);
                        }

                        // If we don't have cached data, download the file

                        if (fileNodeID) {
                          _context.next = 24;
                          break;
                        }

                        _context.prev = 8;
                        _context.next = 11;
                        return createRemoteFileNode({
                          url: e.source_url,
                          store: store,
                          cache: cache,
                          createNode: createNode,
                          auth: _auth
                        });

                      case 11:
                        fileNode = _context.sent;


                        console.log('+++++++++++++++++');
                        console.log('filenodeCreated', count);
                        // console.log(e.mime_type);
                        // console.log(e.source_url)
                        // console.log(fileNode.id)
                        console.log('+++++++++++++++++');
                        count++;

                        if (!fileNode) {
                          _context.next = 20;
                          break;
                        }

                        fileNodeID = fileNode.id;

                        _context.next = 20;
                        return cache.set(mediaDataCacheKey, {
                          fileNodeID: fileNodeID,
                          modified: e.modified
                        });

                      case 20:
                        _context.next = 24;
                        break;

                      case 22:
                        _context.prev = 22;
                        _context.t0 = _context['catch'](8);

                      case 24:

                        if (fileNodeID) {
                          e.localFile___NODE = fileNodeID;
                          delete e.media_details.sizes;
                        }

                        return _context.abrupt('return', e);

                      case 26:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, undefined, [[8, 22]]);
              }));

              return function (_x4) {
                return _ref5.apply(this, arguments);
              };
            }())));

          case 1:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var prepareACFChildNodes = function prepareACFChildNodes(obj, entityId, topLevelIndex, type, children, childrenNodes) {
  // Replace any child arrays with pointers to nodes
  _.each(obj, function (value, key) {
    if (_.isArray(value) && value[0] && value[0].acf_fc_layout) {
      obj[key + '___NODE'] = value.map(function (v) {
        return prepareACFChildNodes(v, entityId, topLevelIndex, type + key, children, childrenNodes).id;
      });
      delete obj[key];
    }
  });

  var acfChildNode = _extends({}, obj, {
    id: entityId + topLevelIndex + type,
    parent: entityId,
    children: [],
    internal: { type: type, contentDigest: digest(JSON.stringify(obj)) }
  });

  children.push(acfChildNode.id);

  // We recursively handle children nodes first, so we need
  // to make sure parent nodes will be before their children.
  // So let's use unshift to put nodes in the beginning.
  childrenNodes.unshift(acfChildNode);

  return acfChildNode;
};

exports.createNodesFromEntities = function (_ref6) {
  var entities = _ref6.entities,
      createNode = _ref6.createNode;

  entities.forEach(function (e) {
    // Create subnodes for ACF Flexible layouts
    var __type = e.__type,
        entity = _objectWithoutProperties(e, ['__type']); // eslint-disable-line no-unused-vars


    var children = [];
    var childrenNodes = [];
    if (entity.acf) {
      _.each(entity.acf, function (value, key) {
        if (_.isArray(value) && value[0] && value[0].acf_fc_layout) {
          entity.acf[key + '_' + entity.type + '___NODE'] = entity.acf[key].map(function (f, i) {
            var type = 'WordPressAcf_' + f.acf_fc_layout;
            delete f.acf_fc_layout;

            var acfChildNode = prepareACFChildNodes(f, entity.id + i, key, type, children, childrenNodes);

            return acfChildNode.id;
          });

          delete entity.acf[key];
        }
      });
    }

    var node = _extends({}, entity, {
      children: children,
      parent: null,
      internal: {
        type: e.__type,
        contentDigest: digest(JSON.stringify(entity))
      }
    });
    createNode(node);
    childrenNodes.forEach(function (node) {
      createNode(node);
    });
  });
};