"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FetchError = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _base = require("./base.js");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/**
 * @typedef {{ address?: string, code: string, dest?: string, errno: number, info?: object, message: string, path?: string, port?: number, syscall: string}} SystemError
*/
/**
 * FetchError interface for operational errors
 */
var FetchError = /*#__PURE__*/function (_FetchBaseError) {
  (0, _inherits2["default"])(FetchError, _FetchBaseError);
  var _super = _createSuper(FetchError);
  /**
   * @param  {string} message -      Error message for human
   * @param  {string} [type] -        Error type for machine
   * @param  {SystemError} [systemError] - For Node.js system error
   */
  function FetchError(message, type, systemError) {
    var _this;
    (0, _classCallCheck2["default"])(this, FetchError);
    _this = _super.call(this, message, type);
    // When err.type is `system`, err.erroredSysCall contains system error and err.code contains system error code
    if (systemError) {
      // eslint-disable-next-line no-multi-assign
      _this.code = _this.errno = systemError.code;
      _this.erroredSysCall = systemError.syscall;
    }
    return _this;
  }
  return (0, _createClass2["default"])(FetchError);
}(_base.FetchBaseError);
exports.FetchError = FetchError;