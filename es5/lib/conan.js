"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _conanSteps = require("./components/conanSteps.js");

var _conanSteps2 = _interopRequireDefault(_conanSteps);

var _mrt = require("mrt");

var _mrt2 = _interopRequireDefault(_mrt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class Conan
 */

var Conan = function (_ChainLink) {
	_inherits(Conan, _ChainLink);

	function Conan() {
		_classCallCheck(this, Conan);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Conan).apply(this, arguments));
	}

	_createClass(Conan, [{
		key: "initialize",

		/**
   * @method initialize
   * @param {Object} config A configuration object that is saved to `conan.config`. There are no options by default, but plugins can add many of them.
   * @return {Conan} An instantiated copy of Conan
   */
		value: function initialize(config) {
			this.config = config || {};
			this.steps = new _conanSteps2.default(this);
			this.plugins = [];
		}
	}, {
		key: "use",
		value: function use() {
			var _this2 = this;

			for (var _len = arguments.length, conanPlugins = Array(_len), _key = 0; _key < _len; _key++) {
				conanPlugins[_key] = arguments[_key];
			}

			conanPlugins.forEach(function (ConanPlugin) {
				return _this2.plugins.push(new ConanPlugin(_this2));
			});
			return this;
		}
	}, {
		key: "deploy",
		value: function deploy(callback) {
			this.steps.start(callback);
		}
	}, {
		key: "version",
		get: function get() {
			return require("../../package.json").version;
		}
	}]);

	return Conan;
}(_mrt2.default);

exports.default = Conan;