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

var _conanAwsGatewayApiStageJs = require("./conanAwsGatewayApiStage.js");

var _conanAwsGatewayApiStageJs2 = _interopRequireDefault(_conanAwsGatewayApiStageJs);

var _stepsFindApiByNameStepJs = require("../steps/findApiByNameStep.js");

var _stepsFindApiByNameStepJs2 = _interopRequireDefault(_stepsFindApiByNameStepJs);

var _stepsUpdateApiStepJs = require("../steps/updateApiStep.js");

var _stepsUpdateApiStepJs2 = _interopRequireDefault(_stepsUpdateApiStepJs);

var _stepsCreateApiStepJs = require("../steps/createApiStep.js");

var _stepsCreateApiStepJs2 = _interopRequireDefault(_stepsCreateApiStepJs);

var ConanAwsGatewayApi = (function (_ConanComponent) {
	_inherits(ConanAwsGatewayApi, _ConanComponent);

	function ConanAwsGatewayApi() {
		_classCallCheck(this, ConanAwsGatewayApi);

		_get(Object.getPrototypeOf(ConanAwsGatewayApi.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(ConanAwsGatewayApi, [{
		key: "initialize",
		value: function initialize(conan, name) {
			this.conan = conan;

			this.parameters("name");

			this.name(name);

			// find api by name
			this.conan.steps.add(_stepsFindApiByNameStepJs2["default"], this);
			this.conan.steps.add(_stepsUpdateApiStepJs2["default"], this);
			this.conan.steps.add(_stepsCreateApiStepJs2["default"], this);
		}
	}, {
		key: "stage",
		value: function stage(name) {
			return new _conanAwsGatewayApiStageJs2["default"](this.conan, name);
		}
	}, {
		key: "api",
		value: function api(name) {
			return new ConanAwsGatewayApi(this.conan, name);
		}
	}]);

	return ConanAwsGatewayApi;
})(_componentsConanComponentJs2["default"]);

exports["default"] = ConanAwsGatewayApi;
module.exports = exports["default"];