"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _componentsConanComponentJs = require("../../../components/conanComponent.js");

var _componentsConanComponentJs2 = _interopRequireDefault(_componentsConanComponentJs);

var _conanAwsApiGatewayResourceJs = require("./conanAwsApiGatewayResource.js");

var _conanAwsApiGatewayResourceJs2 = _interopRequireDefault(_conanAwsApiGatewayResourceJs);

var _stepsFindApiStageByNameStepJs = require("../steps/findApiStageByNameStep.js");

var _stepsFindApiStageByNameStepJs2 = _interopRequireDefault(_stepsFindApiStageByNameStepJs);

var _stepsUpdateApiStageStepJs = require("../steps/updateApiStageStep.js");

var _stepsUpdateApiStageStepJs2 = _interopRequireDefault(_stepsUpdateApiStageStepJs);

var _stepsCreateApiStageStepJs = require("../steps/createApiStageStep.js");

var _stepsCreateApiStageStepJs2 = _interopRequireDefault(_stepsCreateApiStageStepJs);

//potential circular dep

var _conanAwsApiGatewayJs = require("./conanAwsApiGateway.js");

var _conanAwsApiGatewayJs2 = _interopRequireDefault(_conanAwsApiGatewayJs);

var ConanAwsApiGatewayStage = (function (_ConanComponent) {
	_inherits(ConanAwsApiGatewayStage, _ConanComponent);

	function ConanAwsApiGatewayStage() {
		_classCallCheck(this, ConanAwsApiGatewayStage);

		_get(Object.getPrototypeOf(ConanAwsApiGatewayStage.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(ConanAwsApiGatewayStage, [{
		key: "initialize",
		value: function initialize(conan, name) {
			this.conan = conan;

			this.parameters("name", "description");

			this.name(name);

			this.conan.steps.add(_stepsFindApiStageByNameStepJs2["default"], this);
			this.conan.steps.add(_stepsUpdateApiStageStepJs2["default"], this);
			this.conan.steps.add(_stepsCreateApiStageStepJs2["default"], this);
		}
	}, {
		key: "api",
		value: function api(name) {
			return new _conanAwsApiGatewayJs2["default"](this.conan, name);
		}
	}, {
		key: "get",
		value: function get(path) {
			return new _conanAwsApiGatewayResourceJs2["default"](this.conan, path, "GET");
		}
	}, {
		key: "post",
		value: function post(path) {
			return new _conanAwsApiGatewayResourceJs2["default"](this.conan, path, "POST");
		}
	}, {
		key: "put",
		value: function put(path) {
			return new _conanAwsApiGatewayResourceJs2["default"](this.conan, path, "PUT");
		}
	}, {
		key: "delete",
		value: function _delete(path) {
			return new _conanAwsApiGatewayResourceJs2["default"](this.conan, path, "DELETE");
		}
	}]);

	return ConanAwsApiGatewayStage;
})(_componentsConanComponentJs2["default"]);

exports["default"] = ConanAwsApiGatewayStage;
module.exports = exports["default"];