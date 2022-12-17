"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isURLSearchParameters = exports.isSameProtocol = exports.isDomainOrSubdomain = exports.isBlob = exports.isAbortSignal = void 0;
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
/**
 * Is.js
 *
 * Object type checks.
 */

var NAME = Symbol.toStringTag;

/**
 * Check if `obj` is a URLSearchParams object
 * ref: https://github.com/node-fetch/node-fetch/issues/296#issuecomment-307598143
 * @param {*} object - Object to check for
 * @return {boolean}
 */
var isURLSearchParameters = function isURLSearchParameters(object) {
  return (0, _typeof2["default"])(object) === 'object' && typeof object.append === 'function' && typeof object["delete"] === 'function' && typeof object.get === 'function' && typeof object.getAll === 'function' && typeof object.has === 'function' && typeof object.set === 'function' && typeof object.sort === 'function' && object[NAME] === 'URLSearchParams';
};

/**
 * Check if `object` is a W3C `Blob` object (which `File` inherits from)
 * @param {*} object - Object to check for
 * @return {boolean}
 */
exports.isURLSearchParameters = isURLSearchParameters;
var isBlob = function isBlob(object) {
  return object && (0, _typeof2["default"])(object) === 'object' && typeof object.arrayBuffer === 'function' && typeof object.type === 'string' && typeof object.stream === 'function' && typeof object.constructor === 'function' && /^(Blob|File)$/.test(object[NAME]);
};

/**
 * Check if `obj` is an instance of AbortSignal.
 * @param {*} object - Object to check for
 * @return {boolean}
 */
exports.isBlob = isBlob;
var isAbortSignal = function isAbortSignal(object) {
  return (0, _typeof2["default"])(object) === 'object' && (object[NAME] === 'AbortSignal' || object[NAME] === 'EventTarget');
};

/**
 * isDomainOrSubdomain reports whether sub is a subdomain (or exact match) of
 * the parent domain.
 *
 * Both domains must already be in canonical form.
 * @param {string|URL} original
 * @param {string|URL} destination
 */
exports.isAbortSignal = isAbortSignal;
var isDomainOrSubdomain = function isDomainOrSubdomain(destination, original) {
  var orig = new URL(original).hostname;
  var dest = new URL(destination).hostname;
  return orig === dest || orig.endsWith(".".concat(dest));
};

/**
 * isSameProtocol reports whether the two provided URLs use the same protocol.
 *
 * Both domains must already be in canonical form.
 * @param {string|URL} original
 * @param {string|URL} destination
 */
exports.isDomainOrSubdomain = isDomainOrSubdomain;
var isSameProtocol = function isSameProtocol(destination, original) {
  var orig = new URL(original).protocol;
  var dest = new URL(destination).protocol;
  return orig === dest;
};
exports.isSameProtocol = isSameProtocol;