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
	}, {
		key: "multipleValueParameters",
		value: function multipleValueParameters() {
			var _this2 = this;

			var _ = (0, _incognito2["default"])(this);

			for (var _len3 = arguments.length, newParameters = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
				newParameters[_key3] = arguments[_key3];
			}

			newParameters.forEach(function (parameterName) {

				var getterSetterFunction = function getterSetterFunction() {
					for (var _len4 = arguments.length, newValues = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
						newValues[_key4] = arguments[_key4];
					}

					if (newValues.length > 0) {
						_.parameters[parameterName] = newValues;
						return _this2; // For chaining
					} else {
							return _.parameters[parameterName];
						}
				};

				_.parameters[parameterName] = [];
				_this2[parameterName] = getterSetterFunction;
			});
		}
	}, {
		key: "aggregateValueParameters",
		value: function aggregateValueParameters() {
			var _this3 = this;

			var _ = (0, _incognito2["default"])(this);

			for (var _len5 = arguments.length, newParameters = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
				newParameters[_key5] = arguments[_key5];
			}

			newParameters.forEach(function (parameterName) {

				var getterSetterFunction = function getterSetterFunction() {
					for (var _len6 = arguments.length, newValues = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
						newValues[_key6] = arguments[_key6];
					}

					_.parameters[parameterName] = _.parameters[parameterName] || [];
					if (newValues.length > 0) {
						_.parameters[parameterName] = _.parameters[parameterName].concat(newValues);
						return _this3; // For chaining
					} else {
							return _.parameters[parameterName];
						}
				};

				_this3[parameterName] = getterSetterFunction;
			});
		}
	}, {
		key: "multipleValueAggregateParameters",
		value: function multipleValueAggregateParameters() {
			var _this4 = this;

			var _ = (0, _incognito2["default"])(this);

			for (var _len7 = arguments.length, newParameters = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
				newParameters[_key7] = arguments[_key7];
			}

			newParameters.forEach(function (parameterName) {
				_.parameters[parameterName] = _.parameters[parameterName] || [];

				var getterSetterFunction = function getterSetterFunction() {
					for (var _len8 = arguments.length, newValues = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
						newValues[_key8] = arguments[_key8];
					}

					if (newValues.length > 0) {
						_.parameters[parameterName].push(newValues);
						return _this4; // For chaining
					} else {
							return _.parameters[parameterName];
						}
				};

				_.parameters[parameterName] = [];
				_this4[parameterName] = getterSetterFunction;
			});
		}
	}]);

	return ConanComponent;
})();

exports["default"] = ConanComponent;
module.exports = exports["default"];