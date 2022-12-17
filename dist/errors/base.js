"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FetchBaseError = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var FetchBaseError = /*#__PURE__*/function (_Error, _Symbol$toStringTag) {
  (0, _inherits2["default"])(FetchBaseError, _Error);
  var _super = _createSuper(FetchBaseError);
  function FetchBaseError(message, type) {
    var _this;
    (0, _classCallCheck2["default"])(this, FetchBaseError);
    _this = _super.call(this, message);
    // Hide custom error implementation details from end-users
    Error.captureStackTrace((0, _assertThisInitialized2["default"])(_this), _this.constructor);
    _this.type = type;
    return _this;
  }
  (0, _createClass2["default"])(FetchBaseError, [{
    key: "name",
    get: function get() {
      return this.constructor.name;
    }
  }, {
    key: _Symbol$toStringTag,
    get: function get() {
      return this.constructor.name;
    }
  }]);
  return FetchBaseError;
}( /*#__PURE__*/(0, _wrapNativeSuper2["default"])(Error), Symbol.toStringTag);
exports.FetchBaseError = FetchBaseError;