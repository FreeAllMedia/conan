"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ConanComponent = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _conanSteps = require("./components/conanSteps.js");

var _conanSteps2 = _interopRequireDefault(_conanSteps);

var _conanComponent = require("./components/conanComponent.js");

var _conanComponent2 = _interopRequireDefault(_conanComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class Conan
 */

var Conan = function () {
	/**
  * @constructor
  * @method constructor
  * @param {Object} config A configuration object that is saved to `conan.config`. There are no options by default, but plugins can add many of them.
  * @return {Conan} An instantiated copy of Conan
  */

	function Conan(config) {
		_classCallCheck(this, Conan);

		this.config = config || {};
		this.components = { all: [] };
		this.steps = new _conanSteps2.default(this);
		this.plugins = [];
	}

	_createClass(Conan, [{
		key: "use",
		value: function use(ConanPlugin) {
			this.plugins.push(new ConanPlugin(this));
		}
	}, {
		key: "deploy",
		value: function deploy(callback) {
			this.steps.start(callback);
		}
	}, {
		key: "addComponent",
		value: function addComponent(componentName, ComponentConstructor) {
			var _this = this;

			this.components[componentName] = [];
			this[componentName] = function () {
				for (var _len = arguments.length, parameters = Array(_len), _key = 0; _key < _len; _key++) {
					parameters[_key] = arguments[_key];
				}

				parameters.unshift(_this);
				var component = new (Function.prototype.bind.apply(ComponentConstructor, [null].concat(parameters)))();
				_this.components[componentName].push(component);
				_this.components.all.push(component);
				return component;
			};
		}
	}, {
		key: "version",
		get: function get() {
			return require("../../package.json").version;
		}
	}]);

	return Conan;
}();

exports.default = Conan;
exports.ConanComponent = _conanComponent2.default;