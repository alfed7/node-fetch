"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.writeToStream = exports.getTotalBytes = exports.extractContentType = exports["default"] = exports.clone = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _nodeStream = _interopRequireWildcard(require("node:stream"));
var _nodeUtil = require("node:util");
var _nodeBuffer = require("node:buffer");
var _fetchBlob = _interopRequireDefault(require("fetch-blob"));
var _esmMin = require("formdata-polyfill/esm.min.js");
var _fetchError = require("./errors/fetch-error.js");
var _base = require("./errors/base.js");
var _is = require("./utils/is.js");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }
function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, "return": function _return(value) { var ret = this.s["return"]; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, "throw": function _throw(value) { var thr = this.s["return"]; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); }
var pipeline = (0, _nodeUtil.promisify)(_nodeStream["default"].pipeline);
var INTERNALS = Symbol('Body internals');

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
var Body = /*#__PURE__*/function () {
  function Body(body) {
    var _this = this;
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? 0 : _ref$size;
    (0, _classCallCheck2["default"])(this, Body);
    var boundary = null;
    if (body === null) {
      // Body is undefined or null
      body = null;
    } else if ((0, _is.isURLSearchParameters)(body)) {
      // Body is a URLSearchParams
      body = _nodeBuffer.Buffer.from(body.toString());
    } else if ((0, _is.isBlob)(body)) {
      // Body is blob
    } else if (_nodeBuffer.Buffer.isBuffer(body)) {
      // Body is Buffer
    } else if (_nodeUtil.types.isAnyArrayBuffer(body)) {
      // Body is ArrayBuffer
      body = _nodeBuffer.Buffer.from(body);
    } else if (ArrayBuffer.isView(body)) {
      // Body is ArrayBufferView
      body = _nodeBuffer.Buffer.from(body.buffer, body.byteOffset, body.byteLength);
    } else if (body instanceof _nodeStream["default"]) {
      // Body is stream
    } else if (body instanceof _esmMin.FormData) {
      // Body is FormData
      body = (0, _esmMin.formDataToBlob)(body);
      boundary = body.type.split('=')[1];
    } else {
      // None of the above
      // coerce to string then buffer
      body = _nodeBuffer.Buffer.from(String(body));
    }
    var stream = body;
    if (_nodeBuffer.Buffer.isBuffer(body)) {
      stream = _nodeStream["default"].Readable.from(body);
    } else if ((0, _is.isBlob)(body)) {
      stream = _nodeStream["default"].Readable.from(body.stream());
    }
    this[INTERNALS] = {
      body: body,
      stream: stream,
      boundary: boundary,
      disturbed: false,
      error: null
    };
    this.size = size;
    if (body instanceof _nodeStream["default"]) {
      body.on('error', function (error_) {
        var error = error_ instanceof _base.FetchBaseError ? error_ : new _fetchError.FetchError("Invalid response body while trying to fetch ".concat(_this.url, ": ").concat(error_.message), 'system', error_);
        _this[INTERNALS].error = error;
      });
    }
  }
  (0, _createClass2["default"])(Body, [{
    key: "body",
    get: function get() {
      return this[INTERNALS].stream;
    }
  }, {
    key: "bodyUsed",
    get: function get() {
      return this[INTERNALS].disturbed;
    }

    /**
     * Decode response as ArrayBuffer
     *
     * @return  Promise
     */
  }, {
    key: "arrayBuffer",
    value: function () {
      var _arrayBuffer = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var _yield$consumeBody, buffer, byteOffset, byteLength;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return consumeBody(this);
              case 2:
                _yield$consumeBody = _context.sent;
                buffer = _yield$consumeBody.buffer;
                byteOffset = _yield$consumeBody.byteOffset;
                byteLength = _yield$consumeBody.byteLength;
                return _context.abrupt("return", buffer.slice(byteOffset, byteOffset + byteLength));
              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));
      function arrayBuffer() {
        return _arrayBuffer.apply(this, arguments);
      }
      return arrayBuffer;
    }()
  }, {
    key: "formData",
    value: function () {
      var _formData = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        var ct, _formData2, parameters, _iterator2, _step2, _step2$value, name, value, _yield$import, toFormData;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                ct = this.headers.get('content-type');
                if (!ct.startsWith('application/x-www-form-urlencoded')) {
                  _context2.next = 11;
                  break;
                }
                _formData2 = new _esmMin.FormData();
                _context2.t0 = URLSearchParams;
                _context2.next = 6;
                return this.text();
              case 6:
                _context2.t1 = _context2.sent;
                parameters = new _context2.t0(_context2.t1);
                _iterator2 = _createForOfIteratorHelper(parameters);
                try {
                  for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                    _step2$value = (0, _slicedToArray2["default"])(_step2.value, 2), name = _step2$value[0], value = _step2$value[1];
                    _formData2.append(name, value);
                  }
                } catch (err) {
                  _iterator2.e(err);
                } finally {
                  _iterator2.f();
                }
                return _context2.abrupt("return", _formData2);
              case 11:
                _context2.next = 13;
                return Promise.resolve().then(function () {
                  return _interopRequireWildcard(require('./utils/multipart-parser.js'));
                });
              case 13:
                _yield$import = _context2.sent;
                toFormData = _yield$import.toFormData;
                return _context2.abrupt("return", toFormData(this.body, ct));
              case 16:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));
      function formData() {
        return _formData.apply(this, arguments);
      }
      return formData;
    }()
    /**
     * Return raw response as Blob
     *
     * @return Promise
     */
  }, {
    key: "blob",
    value: function () {
      var _blob = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
        var ct, buf;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                ct = this.headers && this.headers.get('content-type') || this[INTERNALS].body && this[INTERNALS].body.type || '';
                _context3.next = 3;
                return this.arrayBuffer();
              case 3:
                buf = _context3.sent;
                return _context3.abrupt("return", new _fetchBlob["default"]([buf], {
                  type: ct
                }));
              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));
      function blob() {
        return _blob.apply(this, arguments);
      }
      return blob;
    }()
    /**
     * Decode response as json
     *
     * @return  Promise
     */
  }, {
    key: "json",
    value: function () {
      var _json = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
        var text;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.text();
              case 2:
                text = _context4.sent;
                return _context4.abrupt("return", JSON.parse(text));
              case 4:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));
      function json() {
        return _json.apply(this, arguments);
      }
      return json;
    }()
    /**
     * Decode response as text
     *
     * @return  Promise
     */
  }, {
    key: "text",
    value: function () {
      var _text = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
        var buffer;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return consumeBody(this);
              case 2:
                buffer = _context5.sent;
                return _context5.abrupt("return", new TextDecoder().decode(buffer));
              case 4:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));
      function text() {
        return _text.apply(this, arguments);
      }
      return text;
    }()
    /**
     * Decode response as buffer (non-spec api)
     *
     * @return  Promise
     */
  }, {
    key: "buffer",
    value: function buffer() {
      return consumeBody(this);
    }
  }]);
  return Body;
}();
exports["default"] = Body;
Body.prototype.buffer = (0, _nodeUtil.deprecate)(Body.prototype.buffer, 'Please use \'response.arrayBuffer()\' instead of \'response.buffer()\'', 'node-fetch#buffer');

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
  body: {
    enumerable: true
  },
  bodyUsed: {
    enumerable: true
  },
  arrayBuffer: {
    enumerable: true
  },
  blob: {
    enumerable: true
  },
  json: {
    enumerable: true
  },
  text: {
    enumerable: true
  },
  data: {
    get: (0, _nodeUtil.deprecate)(function () {}, 'data doesn\'t exist, use json(), text(), arrayBuffer(), or body instead', 'https://github.com/node-fetch/node-fetch/issues/1000 (response)')
  }
});

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return Promise
 */
function consumeBody(_x) {
  return _consumeBody.apply(this, arguments);
}
/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed   instance       Response or Request instance
 * @param   String  highWaterMark  highWaterMark for both PassThrough body streams
 * @return  Mixed
 */
function _consumeBody() {
  _consumeBody = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(data) {
    var body, accum, accumBytes, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, chunk, error, error_;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            if (!data[INTERNALS].disturbed) {
              _context7.next = 2;
              break;
            }
            throw new TypeError("body used already for: ".concat(data.url));
          case 2:
            data[INTERNALS].disturbed = true;
            if (!data[INTERNALS].error) {
              _context7.next = 5;
              break;
            }
            throw data[INTERNALS].error;
          case 5:
            body = data.body; // Body is null
            if (!(body === null)) {
              _context7.next = 8;
              break;
            }
            return _context7.abrupt("return", _nodeBuffer.Buffer.alloc(0));
          case 8:
            if (body instanceof _nodeStream["default"]) {
              _context7.next = 10;
              break;
            }
            return _context7.abrupt("return", _nodeBuffer.Buffer.alloc(0));
          case 10:
            // Body is stream
            // get ready to actually consume the body
            accum = [];
            accumBytes = 0;
            _context7.prev = 12;
            _iteratorAbruptCompletion = false;
            _didIteratorError = false;
            _context7.prev = 15;
            _iterator = _asyncIterator(body);
          case 17:
            _context7.next = 19;
            return _iterator.next();
          case 19:
            if (!(_iteratorAbruptCompletion = !(_step = _context7.sent).done)) {
              _context7.next = 30;
              break;
            }
            chunk = _step.value;
            if (!(data.size > 0 && accumBytes + chunk.length > data.size)) {
              _context7.next = 25;
              break;
            }
            error = new _fetchError.FetchError("content size at ".concat(data.url, " over limit: ").concat(data.size), 'max-size');
            body.destroy(error);
            throw error;
          case 25:
            accumBytes += chunk.length;
            accum.push(chunk);
          case 27:
            _iteratorAbruptCompletion = false;
            _context7.next = 17;
            break;
          case 30:
            _context7.next = 36;
            break;
          case 32:
            _context7.prev = 32;
            _context7.t0 = _context7["catch"](15);
            _didIteratorError = true;
            _iteratorError = _context7.t0;
          case 36:
            _context7.prev = 36;
            _context7.prev = 37;
            if (!(_iteratorAbruptCompletion && _iterator["return"] != null)) {
              _context7.next = 41;
              break;
            }
            _context7.next = 41;
            return _iterator["return"]();
          case 41:
            _context7.prev = 41;
            if (!_didIteratorError) {
              _context7.next = 44;
              break;
            }
            throw _iteratorError;
          case 44:
            return _context7.finish(41);
          case 45:
            return _context7.finish(36);
          case 46:
            _context7.next = 52;
            break;
          case 48:
            _context7.prev = 48;
            _context7.t1 = _context7["catch"](12);
            error_ = _context7.t1 instanceof _base.FetchBaseError ? _context7.t1 : new _fetchError.FetchError("Invalid response body while trying to fetch ".concat(data.url, ": ").concat(_context7.t1.message), 'system', _context7.t1);
            throw error_;
          case 52:
            if (!(body.readableEnded === true || body._readableState.ended === true)) {
              _context7.next = 64;
              break;
            }
            _context7.prev = 53;
            if (!accum.every(function (c) {
              return typeof c === 'string';
            })) {
              _context7.next = 56;
              break;
            }
            return _context7.abrupt("return", _nodeBuffer.Buffer.from(accum.join('')));
          case 56:
            return _context7.abrupt("return", _nodeBuffer.Buffer.concat(accum, accumBytes));
          case 59:
            _context7.prev = 59;
            _context7.t2 = _context7["catch"](53);
            throw new _fetchError.FetchError("Could not create Buffer from response body for ".concat(data.url, ": ").concat(_context7.t2.message), 'system', _context7.t2);
          case 62:
            _context7.next = 65;
            break;
          case 64:
            throw new _fetchError.FetchError("Premature close of server response while trying to fetch ".concat(data.url));
          case 65:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[12, 48], [15, 32, 36, 46], [37,, 41, 45], [53, 59]]);
  }));
  return _consumeBody.apply(this, arguments);
}
var clone = function clone(instance, highWaterMark) {
  var p1;
  var p2;
  var body = instance[INTERNALS].body;

  // Don't allow cloning a used body
  if (instance.bodyUsed) {
    throw new Error('cannot clone body after it is used');
  }

  // Check that body is a stream and not form-data object
  // note: we can't clone the form-data object without having it as a dependency
  if (body instanceof _nodeStream["default"] && typeof body.getBoundary !== 'function') {
    // Tee instance body
    p1 = new _nodeStream.PassThrough({
      highWaterMark: highWaterMark
    });
    p2 = new _nodeStream.PassThrough({
      highWaterMark: highWaterMark
    });
    body.pipe(p1);
    body.pipe(p2);
    // Set instance body to teed body and return the other teed body
    instance[INTERNALS].stream = p1;
    body = p2;
  }
  return body;
};
exports.clone = clone;
var getNonSpecFormDataBoundary = (0, _nodeUtil.deprecate)(function (body) {
  return body.getBoundary();
}, 'form-data doesn\'t follow the spec and requires special treatment. Use alternative package', 'https://github.com/node-fetch/node-fetch/issues/1167');

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param {any} body Any options.body input
 * @returns {string | null}
 */
var extractContentType = function extractContentType(body, request) {
  // Body is null or undefined
  if (body === null) {
    return null;
  }

  // Body is string
  if (typeof body === 'string') {
    return 'text/plain;charset=UTF-8';
  }

  // Body is a URLSearchParams
  if ((0, _is.isURLSearchParameters)(body)) {
    return 'application/x-www-form-urlencoded;charset=UTF-8';
  }

  // Body is blob
  if ((0, _is.isBlob)(body)) {
    return body.type || null;
  }

  // Body is a Buffer (Buffer, ArrayBuffer or ArrayBufferView)
  if (_nodeBuffer.Buffer.isBuffer(body) || _nodeUtil.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
    return null;
  }
  if (body instanceof _esmMin.FormData) {
    return "multipart/form-data; boundary=".concat(request[INTERNALS].boundary);
  }

  // Detect form data input from form-data module
  if (body && typeof body.getBoundary === 'function') {
    return "multipart/form-data;boundary=".concat(getNonSpecFormDataBoundary(body));
  }

  // Body is stream - can't really do much about this
  if (body instanceof _nodeStream["default"]) {
    return null;
  }

  // Body constructor defaults other things to string
  return 'text/plain;charset=UTF-8';
};

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param {any} obj.body Body object from the Body instance.
 * @returns {number | null}
 */
exports.extractContentType = extractContentType;
var getTotalBytes = function getTotalBytes(request) {
  var body = request[INTERNALS].body;

  // Body is null or undefined
  if (body === null) {
    return 0;
  }

  // Body is Blob
  if ((0, _is.isBlob)(body)) {
    return body.size;
  }

  // Body is Buffer
  if (_nodeBuffer.Buffer.isBuffer(body)) {
    return body.length;
  }

  // Detect form data input from form-data module
  if (body && typeof body.getLengthSync === 'function') {
    return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
  }

  // Body is stream
  return null;
};

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param {Stream.Writable} dest The stream to write to.
 * @param obj.body Body object from the Body instance.
 * @returns {Promise<void>}
 */
exports.getTotalBytes = getTotalBytes;
var writeToStream = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(dest, _ref2) {
    var body;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            body = _ref2.body;
            if (!(body === null)) {
              _context6.next = 5;
              break;
            }
            // Body is null
            dest.end();
            _context6.next = 7;
            break;
          case 5:
            _context6.next = 7;
            return pipeline(body, dest);
          case 7:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
  return function writeToStream(_x2, _x3) {
    return _ref3.apply(this, arguments);
  };
}();
exports.writeToStream = writeToStream;