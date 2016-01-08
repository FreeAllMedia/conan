"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

var ConanComponent = (function () {
	function ConanComponent() {
		_classCallCheck(this, ConanComponent);

		(0, _incognito2["default"])(this).parameters = {};

		//initialize the parameters object

		for (var _len = arguments.length, componentArguments = Array(_len), _key = 0; _key < _len; _key++) {
			componentArguments[_key] = arguments[_key];
		}

		this.initialize.apply(this, componentArguments);
	}

	_createClass(ConanComponent, [{
		key: "initialize",
		value: function initialize() {}
		// Stub for overridding

	}, {
		key: "parameters",
		value: function parameters() {
			var _this = this;

			var _ = (0, _incognito2["default"])(this);

			for (var _len2 = arguments.length, newParameters = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				newParameters[_key2] = arguments[_key2];
			}

			if (newParameters.length > 0) {
				newParameters.forEach(function (parameterName) {

					var getterSetterFunction = function getterSetterFunction(newValue) {
						if (newValue) {
							_.parameters[parameterName] = newValue;
							return _this; // For chaining
						} else {
								return _.parameters[parameterName];
							}
					};

					_this[parameterName] = getterSetterFunction;
				});
			} else {
				return _.parameters;
			}
		}
	}]);

	return ConanComponent;
})();

exports["default"] = ConanComponent;
module.exports = exports["default"];