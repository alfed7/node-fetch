"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
exports.fromRawHeaders = fromRawHeaders;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));
var _nodeUtil = require("node:util");
var _nodeHttp = _interopRequireDefault(require("node:http"));
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/* c8 ignore next 9 */
var validateHeaderName = typeof _nodeHttp["default"].validateHeaderName === 'function' ? _nodeHttp["default"].validateHeaderName : function (name) {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
    var error = new TypeError("Header name must be a valid HTTP token [".concat(name, "]"));
    Object.defineProperty(error, 'code', {
      value: 'ERR_INVALID_HTTP_TOKEN'
    });
    throw error;
  }
};

/* c8 ignore next 9 */
var validateHeaderValue = typeof _nodeHttp["default"].validateHeaderValue === 'function' ? _nodeHttp["default"].validateHeaderValue : function (name, value) {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
    var error = new TypeError("Invalid character in header content [\"".concat(name, "\"]"));
    Object.defineProperty(error, 'code', {
      value: 'ERR_INVALID_CHAR'
    });
    throw error;
  }
};

/**
 * @typedef {Headers | Record<string, string> | Iterable<readonly [string, string]> | Iterable<Iterable<string>>} HeadersInit
 */

/**
 * This Fetch API interface allows you to perform various actions on HTTP request and response headers.
 * These actions include retrieving, setting, adding to, and removing.
 * A Headers object has an associated header list, which is initially empty and consists of zero or more name and value pairs.
 * You can add to this using methods like append() (see Examples.)
 * In all methods of this interface, header names are matched by case-insensitive byte sequence.
 *
 */
var Headers = /*#__PURE__*/function (_URLSearchParams, _Symbol$toStringTag, _Symbol$iterator, _Symbol$for) {
  (0, _inherits2["default"])(Headers, _URLSearchParams);
  var _super = _createSuper(Headers);
  /**
   * Headers class
   *
   * @constructor
   * @param {HeadersInit} [init] - Response headers
   */
  function Headers(init) {
    var _this;
    (0, _classCallCheck2["default"])(this, Headers);
    // Validate and normalize init object in [name, value(s)][]
    /** @type {string[][]} */
    var result = [];
    if (init instanceof Headers) {
      var raw = init.raw();
      var _loop = function _loop() {
        var _result;
        var _Object$entries$_i = (0, _slicedToArray2["default"])(_Object$entries[_i], 2),
          name = _Object$entries$_i[0],
          values = _Object$entries$_i[1];
        (_result = result).push.apply(_result, (0, _toConsumableArray2["default"])(values.map(function (value) {
          return [name, value];
        })));
      };
      for (var _i = 0, _Object$entries = Object.entries(raw); _i < _Object$entries.length; _i++) {
        _loop();
      }
    } else if (init == null) {// eslint-disable-line no-eq-null, eqeqeq
      // No op
    } else if ((0, _typeof2["default"])(init) === 'object' && !_nodeUtil.types.isBoxedPrimitive(init)) {
      var method = init[Symbol.iterator];
      // eslint-disable-next-line no-eq-null, eqeqeq
      if (method == null) {
        var _result2;
        // Record<ByteString, ByteString>
        (_result2 = result).push.apply(_result2, (0, _toConsumableArray2["default"])(Object.entries(init)));
      } else {
        if (typeof method !== 'function') {
          throw new TypeError('Header pairs must be iterable');
        }

        // Sequence<sequence<ByteString>>
        // Note: per spec we have to first exhaust the lists then process them
        result = (0, _toConsumableArray2["default"])(init).map(function (pair) {
          if ((0, _typeof2["default"])(pair) !== 'object' || _nodeUtil.types.isBoxedPrimitive(pair)) {
            throw new TypeError('Each header pair must be an iterable object');
          }
          return (0, _toConsumableArray2["default"])(pair);
        }).map(function (pair) {
          if (pair.length !== 2) {
            throw new TypeError('Each header pair must be a name/value tuple');
          }
          return (0, _toConsumableArray2["default"])(pair);
        });
      }
    } else {
      throw new TypeError('Failed to construct \'Headers\': The provided value is not of type \'(sequence<sequence<ByteString>> or record<ByteString, ByteString>)');
    }

    // Validate and lowercase
    result = result.length > 0 ? result.map(function (_ref) {
      var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
        name = _ref2[0],
        value = _ref2[1];
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return [String(name).toLowerCase(), String(value)];
    }) : undefined;
    _this = _super.call(this, result);

    // Returning a Proxy that will lowercase key names, validate parameters and sort keys
    // eslint-disable-next-line no-constructor-return
    return (0, _possibleConstructorReturn2["default"])(_this, new Proxy((0, _assertThisInitialized2["default"])(_this), {
      get: function get(target, p, receiver) {
        switch (p) {
          case 'append':
          case 'set':
            return function (name, value) {
              validateHeaderName(name);
              validateHeaderValue(name, String(value));
              return URLSearchParams.prototype[p].call(target, String(name).toLowerCase(), String(value));
            };
          case 'delete':
          case 'has':
          case 'getAll':
            return function (name) {
              validateHeaderName(name);
              return URLSearchParams.prototype[p].call(target, String(name).toLowerCase());
            };
          case 'keys':
            return function () {
              target.sort();
              return new Set(URLSearchParams.prototype.keys.call(target)).keys();
            };
          default:
            return Reflect.get(target, p, receiver);
        }
      }
    }));
    /* c8 ignore next */
  }
  (0, _createClass2["default"])(Headers, [{
    key: _Symbol$toStringTag,
    get: function get() {
      return this.constructor.name;
    }
  }, {
    key: "toString",
    value: function toString() {
      return Object.prototype.toString.call(this);
    }
  }, {
    key: "get",
    value: function get(name) {
      var values = this.getAll(name);
      if (values.length === 0) {
        return null;
      }
      var value = values.join(', ');
      if (/^content-encoding$/i.test(name)) {
        value = value.toLowerCase();
      }
      return value;
    }
  }, {
    key: "forEach",
    value: function forEach(callback) {
      var thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      var _iterator = _createForOfIteratorHelper(this.keys()),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var name = _step.value;
          Reflect.apply(callback, thisArg, [this.get(name), name, this]);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "values",
    value: /*#__PURE__*/_regenerator["default"].mark(function values() {
      var _iterator2, _step2, name;
      return _regenerator["default"].wrap(function values$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _iterator2 = _createForOfIteratorHelper(this.keys());
              _context.prev = 1;
              _iterator2.s();
            case 3:
              if ((_step2 = _iterator2.n()).done) {
                _context.next = 9;
                break;
              }
              name = _step2.value;
              _context.next = 7;
              return this.get(name);
            case 7:
              _context.next = 3;
              break;
            case 9:
              _context.next = 14;
              break;
            case 11:
              _context.prev = 11;
              _context.t0 = _context["catch"](1);
              _iterator2.e(_context.t0);
            case 14:
              _context.prev = 14;
              _iterator2.f();
              return _context.finish(14);
            case 17:
            case "end":
              return _context.stop();
          }
        }
      }, values, this, [[1, 11, 14, 17]]);
    })
    /**
     * @type {() => IterableIterator<[string, string]>}
     */
  }, {
    key: "entries",
    value:
    /*#__PURE__*/
    _regenerator["default"].mark(function entries() {
      var _iterator3, _step3, name;
      return _regenerator["default"].wrap(function entries$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _iterator3 = _createForOfIteratorHelper(this.keys());
              _context2.prev = 1;
              _iterator3.s();
            case 3:
              if ((_step3 = _iterator3.n()).done) {
                _context2.next = 9;
                break;
              }
              name = _step3.value;
              _context2.next = 7;
              return [name, this.get(name)];
            case 7:
              _context2.next = 3;
              break;
            case 9:
              _context2.next = 14;
              break;
            case 11:
              _context2.prev = 11;
              _context2.t0 = _context2["catch"](1);
              _iterator3.e(_context2.t0);
            case 14:
              _context2.prev = 14;
              _iterator3.f();
              return _context2.finish(14);
            case 17:
            case "end":
              return _context2.stop();
          }
        }
      }, entries, this, [[1, 11, 14, 17]]);
    })
  }, {
    key: _Symbol$iterator,
    value: function value() {
      return this.entries();
    }

    /**
     * Node-fetch non-spec method
     * returning all headers and their values as array
     * @returns {Record<string, string[]>}
     */
  }, {
    key: "raw",
    value: function raw() {
      var _this2 = this;
      return (0, _toConsumableArray2["default"])(this.keys()).reduce(function (result, key) {
        result[key] = _this2.getAll(key);
        return result;
      }, {});
    }

    /**
     * For better console.log(headers) and also to convert Headers into Node.js Request compatible format
     */
  }, {
    key: _Symbol$for,
    value: function value() {
      var _this3 = this;
      return (0, _toConsumableArray2["default"])(this.keys()).reduce(function (result, key) {
        var values = _this3.getAll(key);
        // Http.request() only supports string as Host header.
        // This hack makes specifying custom Host header possible.
        if (key === 'host') {
          result[key] = values[0];
        } else {
          result[key] = values.length > 1 ? values : values[0];
        }
        return result;
      }, {});
    }
  }]);
  return Headers;
}( /*#__PURE__*/(0, _wrapNativeSuper2["default"])(URLSearchParams), Symbol.toStringTag, Symbol.iterator, Symbol["for"]('nodejs.util.inspect.custom'));
/**
 * Re-shaping object for Web IDL tests
 * Only need to do it for overridden methods
 */
exports["default"] = Headers;
Object.defineProperties(Headers.prototype, ['get', 'entries', 'forEach', 'values'].reduce(function (result, property) {
  result[property] = {
    enumerable: true
  };
  return result;
}, {}));

/**
 * Create a Headers object from an http.IncomingMessage.rawHeaders, ignoring those that do
 * not conform to HTTP grammar productions.
 * @param {import('http').IncomingMessage['rawHeaders']} headers
 */
function fromRawHeaders() {
  var headers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return new Headers(headers
  // Split into pairs
  .reduce(function (result, value, index, array) {
    if (index % 2 === 0) {
      result.push(array.slice(index, index + 2));
    }
    return result;
  }, []).filter(function (_ref3) {
    var _ref4 = (0, _slicedToArray2["default"])(_ref3, 2),
      name = _ref4[0],
      value = _ref4[1];
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch (_unused) {
      return false;
    }
  }));
}