"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mrt = require("mrt");

var _mrt2 = _interopRequireDefault(_mrt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ConanComponent = function (_ChainLink) {
  _inherits(ConanComponent, _ChainLink);

  function ConanComponent() {
    _classCallCheck(this, ConanComponent);

    return _possibleConstructorReturn(this, (ConanComponent.__proto__ || Object.getPrototypeOf(ConanComponent)).apply(this, arguments));
  }

  return ConanComponent;
}(_mrt2.default);

exports.default = ConanComponent;