"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _staircase = require("staircase");

var _staircase2 = _interopRequireDefault(_staircase);

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

var _conanComponent = require("./conanComponent.js");

var _conanComponent2 = _interopRequireDefault(_conanComponent);

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class Conan
 */
var Conan = function (_ConanComponent) {
	_inherits(Conan, _ConanComponent);

	function Conan() {
		_classCallCheck(this, Conan);

		return _possibleConstructorReturn(this, (Conan.__proto__ || Object.getPrototypeOf(Conan)).apply(this, arguments));
	}

	_createClass(Conan, [{
		key: "initialize",

		/**
   * @method initialize
   * @param {Object} config A configuration object that is saved to `conan.config`. There are no options by default, but plugins can add them.
   * @return {Conan} An instantiated copy of Conan
   */
		value: function initialize(config) {
			this.config = config || {};
			this.plugins = [];

			var _ = (0, _incognito2.default)(this);

			_.staircase = new _staircase2.default(this);

			this.stepGroups = _.staircase.stepGroups;
			this.events = _.staircase.events;
		}
	}, {
		key: "on",
		value: function on(name, listener) {
			this.events.on(name, listener);
			return this;
		}
	}, {
		key: "parallel",
		value: function parallel() {
			var _privateData$staircas;

			return (_privateData$staircas = (0, _incognito2.default)(this).staircase).parallel.apply(_privateData$staircas, arguments);
		}
	}, {
		key: "series",
		value: function series() {
			var _privateData$staircas2;

			return (_privateData$staircas2 = (0, _incognito2.default)(this).staircase).series.apply(_privateData$staircas2, arguments);
		}
	}, {
		key: "step",
		value: function step(_step) {
			(0, _incognito2.default)(this).staircase.step(_step);
			return this;
		}
	}, {
		key: "stepNames",
		value: function stepNames() {
			var names = [];

			this.stepGroups().forEach(function (stepGroup) {
				stepGroup.steps.forEach(function (step) {
					names.push(step.name);
				});
			});

			return names;
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
			(0, _incognito2.default)(this).staircase.results(callback);
		}
	}, {
		key: "version",
		get: function get() {
			return require("../../package.json").version;
		}
	}]);

	return Conan;
}(_conanComponent2.default);

exports.default = Conan;