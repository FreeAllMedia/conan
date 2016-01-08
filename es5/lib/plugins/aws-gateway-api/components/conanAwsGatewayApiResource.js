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

var _stepsFindApiResourceByPathStepJs = require("../steps/findApiResourceByPathStep.js");

var _stepsFindApiResourceByPathStepJs2 = _interopRequireDefault(_stepsFindApiResourceByPathStepJs);

var _stepsCreateApiResourcesStepJs = require("../steps/createApiResourcesStep.js");

var _stepsCreateApiResourcesStepJs2 = _interopRequireDefault(_stepsCreateApiResourcesStepJs);

var _stepsFindResourceMethodStepJs = require("../steps/findResourceMethodStep.js");

var _stepsFindResourceMethodStepJs2 = _interopRequireDefault(_stepsFindResourceMethodStepJs);

var _stepsCreateResourceMethodStepJs = require("../steps/createResourceMethodStep.js");

var _stepsCreateResourceMethodStepJs2 = _interopRequireDefault(_stepsCreateResourceMethodStepJs);

var ConanAwsGatewayApiResource = (function (_ConanComponent) {
	_inherits(ConanAwsGatewayApiResource, _ConanComponent);

	function ConanAwsGatewayApiResource() {
		_classCallCheck(this, ConanAwsGatewayApiResource);

		_get(Object.getPrototypeOf(ConanAwsGatewayApiResource.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(ConanAwsGatewayApiResource, [{
		key: "initialize",
		value: function initialize(conan, path, method) {
			this.conan = conan;

			this.parameters("path", "method");

			this.path(path);
			this.method(method);

			this.conan.steps.add(_stepsFindApiResourceByPathStepJs2["default"], this);
			this.conan.steps.add(_stepsCreateApiResourcesStepJs2["default"], this);
			this.conan.steps.add(_stepsFindResourceMethodStepJs2["default"], this);
			this.conan.steps.add(_stepsCreateResourceMethodStepJs2["default"], this);
		}
	}, {
		key: "get",
		value: function get(path) {
			return new ConanAwsGatewayApiResource(this.conan, path, "GET");
		}
	}, {
		key: "post",
		value: function post(path) {
			return new ConanAwsGatewayApiResource(this.conan, path, "POST");
		}
	}, {
		key: "put",
		value: function put(path) {
			return new ConanAwsGatewayApiResource(this.conan, path, "PUT");
		}
	}, {
		key: "delete",
		value: function _delete(path) {
			return new ConanAwsGatewayApiResource(this.conan, path, "DELETE");
		}
	}]);

	return ConanAwsGatewayApiResource;
})(_componentsConanComponentJs2["default"]);

exports["default"] = ConanAwsGatewayApiResource;
module.exports = exports["default"];