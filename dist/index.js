"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "AbortError", {
  enumerable: true,
  get: function get() {
    return _abortError.AbortError;
  }
});
Object.defineProperty(exports, "Blob", {
  enumerable: true,
  get: function get() {
    return _from.Blob;
  }
});
Object.defineProperty(exports, "FetchError", {
  enumerable: true,
  get: function get() {
    return _fetchError.FetchError;
  }
});
Object.defineProperty(exports, "File", {
  enumerable: true,
  get: function get() {
    return _from.File;
  }
});
Object.defineProperty(exports, "FormData", {
  enumerable: true,
  get: function get() {
    return _esmMin.FormData;
  }
});
Object.defineProperty(exports, "Headers", {
  enumerable: true,
  get: function get() {
    return _headers["default"];
  }
});
Object.defineProperty(exports, "Request", {
  enumerable: true,
  get: function get() {
    return _request["default"];
  }
});
Object.defineProperty(exports, "Response", {
  enumerable: true,
  get: function get() {
    return _response2["default"];
  }
});
Object.defineProperty(exports, "blobFrom", {
  enumerable: true,
  get: function get() {
    return _from.blobFrom;
  }
});
Object.defineProperty(exports, "blobFromSync", {
  enumerable: true,
  get: function get() {
    return _from.blobFromSync;
  }
});
exports["default"] = fetch;
Object.defineProperty(exports, "fileFrom", {
  enumerable: true,
  get: function get() {
    return _from.fileFrom;
  }
});
Object.defineProperty(exports, "fileFromSync", {
  enumerable: true,
  get: function get() {
    return _from.fileFromSync;
  }
});
Object.defineProperty(exports, "isRedirect", {
  enumerable: true,
  get: function get() {
    return _isRedirect.isRedirect;
  }
});
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _nodeHttp = _interopRequireDefault(require("node:http"));
var _nodeHttps = _interopRequireDefault(require("node:https"));
var _nodeZlib = _interopRequireDefault(require("node:zlib"));
var _nodeStream = _interopRequireWildcard(require("node:stream"));
var _nodeBuffer = require("node:buffer");
var _dataUriToBuffer = _interopRequireDefault(require("data-uri-to-buffer"));
var _body = require("./body.js");
var _response2 = _interopRequireDefault(require("./response.js"));
var _headers = _interopRequireWildcard(require("./headers.js"));
var _request = _interopRequireWildcard(require("./request.js"));
var _fetchError = require("./errors/fetch-error.js");
var _abortError = require("./errors/abort-error.js");
var _isRedirect = require("./utils/is-redirect.js");
var _esmMin = require("formdata-polyfill/esm.min.js");
var _is = require("./utils/is.js");
var _referrer = require("./utils/referrer.js");
var _from = require("fetch-blob/from.js");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/**
 * Index.js
 *
 * a request API compatible with window.fetch
 *
 * All spec algorithm step numbers are based on https://fetch.spec.whatwg.org/commit-snapshots/ae716822cb3a61843226cd090eefc6589446c1d2/.
 */

var supportedSchemas = new Set(['data:', 'http:', 'https:']);

/**
 * Fetch function
 *
 * @param   {string | URL | import('./request').default} url - Absolute url or Request instance
 * @param   {*} [options_] - Fetch options
 * @return  {Promise<import('./response').default>}
 */
function fetch(_x, _x2) {
  return _fetch.apply(this, arguments);
}
function _fetch() {
  _fetch = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(url, options_) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", new Promise(function (resolve, reject) {
              // Build request object
              var request = new _request["default"](url, options_);
              var _getNodeRequestOption = (0, _request.getNodeRequestOptions)(request),
                parsedURL = _getNodeRequestOption.parsedURL,
                options = _getNodeRequestOption.options;
              if (!supportedSchemas.has(parsedURL.protocol)) {
                throw new TypeError("node-fetch cannot load ".concat(url, ". URL scheme \"").concat(parsedURL.protocol.replace(/:$/, ''), "\" is not supported."));
              }
              if (parsedURL.protocol === 'data:') {
                var data = (0, _dataUriToBuffer["default"])(request.url);
                var _response = new _response2["default"](data, {
                  headers: {
                    'Content-Type': data.typeFull
                  }
                });
                resolve(_response);
                return;
              }

              // Wrap http.request into fetch
              var send = (parsedURL.protocol === 'https:' ? _nodeHttps["default"] : _nodeHttp["default"]).request;
              var signal = request.signal;
              var response = null;
              var abort = function abort() {
                var error = new _abortError.AbortError('The operation was aborted.');
                reject(error);
                if (request.body && request.body instanceof _nodeStream["default"].Readable) {
                  request.body.destroy(error);
                }
                if (!response || !response.body) {
                  return;
                }
                response.body.emit('error', error);
              };
              if (signal && signal.aborted) {
                abort();
                return;
              }
              var abortAndFinalize = function abortAndFinalize() {
                abort();
                finalize();
              };

              // Send request
              var request_ = send(parsedURL.toString(), options);
              if (signal) {
                signal.addEventListener('abort', abortAndFinalize);
              }
              var finalize = function finalize() {
                request_.abort();
                if (signal) {
                  signal.removeEventListener('abort', abortAndFinalize);
                }
              };
              request_.on('error', function (error) {
                reject(new _fetchError.FetchError("request to ".concat(request.url, " failed, reason: ").concat(error.message), 'system', error));
                finalize();
              });
              fixResponseChunkedTransferBadEnding(request_, function (error) {
                if (response && response.body) {
                  response.body.destroy(error);
                }
              });

              /* c8 ignore next 18 */
              if (process.version < 'v14') {
                // Before Node.js 14, pipeline() does not fully support async iterators and does not always
                // properly handle when the socket close/end events are out of order.
                request_.on('socket', function (s) {
                  var endedWithEventsCount;
                  s.prependListener('end', function () {
                    endedWithEventsCount = s._eventsCount;
                  });
                  s.prependListener('close', function (hadError) {
                    // if end happened before close but the socket didn't emit an error, do it now
                    if (response && endedWithEventsCount < s._eventsCount && !hadError) {
                      var error = new Error('Premature close');
                      error.code = 'ERR_STREAM_PREMATURE_CLOSE';
                      response.body.emit('error', error);
                    }
                  });
                });
              }
              request_.on('response', function (response_) {
                request_.setTimeout(0);
                var headers = (0, _headers.fromRawHeaders)(response_.rawHeaders);

                // HTTP fetch step 5
                if ((0, _isRedirect.isRedirect)(response_.statusCode)) {
                  // HTTP fetch step 5.2
                  var location = headers.get('Location');

                  // HTTP fetch step 5.3
                  var locationURL = null;
                  try {
                    locationURL = location === null ? null : new URL(location, request.url);
                  } catch (_unused) {
                    // error here can only be invalid URL in Location: header
                    // do not throw when options.redirect == manual
                    // let the user extract the errorneous redirect URL
                    if (request.redirect !== 'manual') {
                      reject(new _fetchError.FetchError("uri requested responds with an invalid redirect URL: ".concat(location), 'invalid-redirect'));
                      finalize();
                      return;
                    }
                  }

                  // HTTP fetch step 5.5
                  switch (request.redirect) {
                    case 'error':
                      reject(new _fetchError.FetchError("uri requested responds with a redirect, redirect mode is set to error: ".concat(request.url), 'no-redirect'));
                      finalize();
                      return;
                    case 'manual':
                      // Nothing to do
                      break;
                    case 'follow':
                      {
                        // HTTP-redirect fetch step 2
                        if (locationURL === null) {
                          break;
                        }

                        // HTTP-redirect fetch step 5
                        if (request.counter >= request.follow) {
                          reject(new _fetchError.FetchError("maximum redirect reached at: ".concat(request.url), 'max-redirect'));
                          finalize();
                          return;
                        }

                        // HTTP-redirect fetch step 6 (counter increment)
                        // Create a new Request object.
                        var requestOptions = {
                          headers: new _headers["default"](request.headers),
                          follow: request.follow,
                          counter: request.counter + 1,
                          agent: request.agent,
                          compress: request.compress,
                          method: request.method,
                          body: (0, _body.clone)(request),
                          signal: request.signal,
                          size: request.size,
                          referrer: request.referrer,
                          referrerPolicy: request.referrerPolicy
                        };

                        // when forwarding sensitive headers like "Authorization",
                        // "WWW-Authenticate", and "Cookie" to untrusted targets,
                        // headers will be ignored when following a redirect to a domain
                        // that is not a subdomain match or exact match of the initial domain.
                        // For example, a redirect from "foo.com" to either "foo.com" or "sub.foo.com"
                        // will forward the sensitive headers, but a redirect to "bar.com" will not.
                        // headers will also be ignored when following a redirect to a domain using
                        // a different protocol. For example, a redirect from "https://foo.com" to "http://foo.com"
                        // will not forward the sensitive headers
                        if (!(0, _is.isDomainOrSubdomain)(request.url, locationURL) || !(0, _is.isSameProtocol)(request.url, locationURL)) {
                          for (var _i = 0, _arr = ['authorization', 'www-authenticate', 'cookie', 'cookie2']; _i < _arr.length; _i++) {
                            var name = _arr[_i];
                            requestOptions.headers["delete"](name);
                          }
                        }

                        // HTTP-redirect fetch step 9
                        if (response_.statusCode !== 303 && request.body && options_.body instanceof _nodeStream["default"].Readable) {
                          reject(new _fetchError.FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
                          finalize();
                          return;
                        }

                        // HTTP-redirect fetch step 11
                        if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === 'POST') {
                          requestOptions.method = 'GET';
                          requestOptions.body = undefined;
                          requestOptions.headers["delete"]('content-length');
                        }

                        // HTTP-redirect fetch step 14
                        var responseReferrerPolicy = (0, _referrer.parseReferrerPolicyFromHeader)(headers);
                        if (responseReferrerPolicy) {
                          requestOptions.referrerPolicy = responseReferrerPolicy;
                        }

                        // HTTP-redirect fetch step 15
                        resolve(fetch(new _request["default"](locationURL, requestOptions)));
                        finalize();
                        return;
                      }
                    default:
                      return reject(new TypeError("Redirect option '".concat(request.redirect, "' is not a valid value of RequestRedirect")));
                  }
                }

                // Prepare response
                if (signal) {
                  response_.once('end', function () {
                    signal.removeEventListener('abort', abortAndFinalize);
                  });
                }
                var body = (0, _nodeStream.pipeline)(response_, new _nodeStream.PassThrough(), function (error) {
                  if (error) {
                    reject(error);
                  }
                });
                // see https://github.com/nodejs/node/pull/29376
                /* c8 ignore next 3 */
                if (process.version < 'v12.10') {
                  response_.on('aborted', abortAndFinalize);
                }
                var responseOptions = {
                  url: request.url,
                  status: response_.statusCode,
                  statusText: response_.statusMessage,
                  headers: headers,
                  size: request.size,
                  counter: request.counter,
                  highWaterMark: request.highWaterMark
                };

                // HTTP-network fetch step 12.1.1.3
                var codings = headers.get('Content-Encoding');

                // HTTP-network fetch step 12.1.1.4: handle content codings

                // in following scenarios we ignore compression support
                // 1. compression support is disabled
                // 2. HEAD request
                // 3. no Content-Encoding header
                // 4. no content response (204)
                // 5. content not modified response (304)
                if (!request.compress || request.method === 'HEAD' || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
                  response = new _response2["default"](body, responseOptions);
                  resolve(response);
                  return;
                }

                // For Node v6+
                // Be less strict when decoding compressed responses, since sometimes
                // servers send slightly invalid responses that are still accepted
                // by common browsers.
                // Always using Z_SYNC_FLUSH is what cURL does.
                var zlibOptions = {
                  flush: _nodeZlib["default"].Z_SYNC_FLUSH,
                  finishFlush: _nodeZlib["default"].Z_SYNC_FLUSH
                };

                // For gzip
                if (codings === 'gzip' || codings === 'x-gzip') {
                  body = (0, _nodeStream.pipeline)(body, _nodeZlib["default"].createGunzip(zlibOptions), function (error) {
                    if (error) {
                      reject(error);
                    }
                  });
                  response = new _response2["default"](body, responseOptions);
                  resolve(response);
                  return;
                }

                // For deflate
                if (codings === 'deflate' || codings === 'x-deflate') {
                  // Handle the infamous raw deflate response from old servers
                  // a hack for old IIS and Apache servers
                  var raw = (0, _nodeStream.pipeline)(response_, new _nodeStream.PassThrough(), function (error) {
                    if (error) {
                      reject(error);
                    }
                  });
                  raw.once('data', function (chunk) {
                    // See http://stackoverflow.com/questions/37519828
                    if ((chunk[0] & 0x0F) === 0x08) {
                      body = (0, _nodeStream.pipeline)(body, _nodeZlib["default"].createInflate(), function (error) {
                        if (error) {
                          reject(error);
                        }
                      });
                    } else {
                      body = (0, _nodeStream.pipeline)(body, _nodeZlib["default"].createInflateRaw(), function (error) {
                        if (error) {
                          reject(error);
                        }
                      });
                    }
                    response = new _response2["default"](body, responseOptions);
                    resolve(response);
                  });
                  raw.once('end', function () {
                    // Some old IIS servers return zero-length OK deflate responses, so
                    // 'data' is never emitted. See https://github.com/node-fetch/node-fetch/pull/903
                    if (!response) {
                      response = new _response2["default"](body, responseOptions);
                      resolve(response);
                    }
                  });
                  return;
                }

                // For br
                if (codings === 'br') {
                  body = (0, _nodeStream.pipeline)(body, _nodeZlib["default"].createBrotliDecompress(), function (error) {
                    if (error) {
                      reject(error);
                    }
                  });
                  response = new _response2["default"](body, responseOptions);
                  resolve(response);
                  return;
                }

                // Otherwise, use response as-is
                response = new _response2["default"](body, responseOptions);
                resolve(response);
              });

              // eslint-disable-next-line promise/prefer-await-to-then
              (0, _body.writeToStream)(request_, request)["catch"](reject);
            }));
          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _fetch.apply(this, arguments);
}
function fixResponseChunkedTransferBadEnding(request, errorCallback) {
  var LAST_CHUNK = _nodeBuffer.Buffer.from('0\r\n\r\n');
  var isChunkedTransfer = false;
  var properLastChunkReceived = false;
  var previousChunk;
  request.on('response', function (response) {
    var headers = response.headers;
    isChunkedTransfer = headers['transfer-encoding'] === 'chunked' && !headers['content-length'];
  });
  request.on('socket', function (socket) {
    var onSocketClose = function onSocketClose() {
      if (isChunkedTransfer && !properLastChunkReceived) {
        var error = new Error('Premature close');
        error.code = 'ERR_STREAM_PREMATURE_CLOSE';
        errorCallback(error);
      }
    };
    var onData = function onData(buf) {
      properLastChunkReceived = _nodeBuffer.Buffer.compare(buf.slice(-5), LAST_CHUNK) === 0;

      // Sometimes final 0-length chunk and end of message code are in separate packets
      if (!properLastChunkReceived && previousChunk) {
        properLastChunkReceived = _nodeBuffer.Buffer.compare(previousChunk.slice(-3), LAST_CHUNK.slice(0, 3)) === 0 && _nodeBuffer.Buffer.compare(buf.slice(-2), LAST_CHUNK.slice(3)) === 0;
      }
      previousChunk = buf;
    };
    socket.prependListener('close', onSocketClose);
    socket.on('data', onData);
    request.on('close', function () {
      socket.removeListener('close', onSocketClose);
      socket.removeListener('data', onData);
    });
  });
}