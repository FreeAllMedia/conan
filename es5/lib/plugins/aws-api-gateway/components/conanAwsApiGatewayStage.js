"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _conanComponent = require("../../../components/conanComponent.js");

var _conanComponent2 = _interopRequireDefault(_conanComponent);

var _conanAwsApiGatewayResource = require("./conanAwsApiGatewayResource.js");

var _conanAwsApiGatewayResource2 = _interopRequireDefault(_conanAwsApiGatewayResource);

var _findApiStageByNameStep = require("../steps/findApiStageByNameStep.js");

var _findApiStageByNameStep2 = _interopRequireDefault(_findApiStageByNameStep);

var _updateApiStageStep = require("../steps/updateApiStageStep.js");

var _updateApiStageStep2 = _interopRequireDefault(_updateApiStageStep);

var _createApiStageStep = require("../steps/createApiStageStep.js");

var _createApiStageStep2 = _interopRequireDefault(_createApiStageStep);

var _conanAwsApiGateway = require("./conanAwsApiGateway.js");

var _conanAwsApiGateway2 = _interopRequireDefault(_conanAwsApiGateway);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
//potential circular dep


var ConanAwsApiGatewayStage = function (_ConanComponent) {
	_inherits(ConanAwsApiGatewayStage, _ConanComponent);

	function ConanAwsApiGatewayStage() {
		_classCallCheck(this, ConanAwsApiGatewayStage);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(ConanAwsApiGatewayStage).apply(this, arguments));
	}

	_createClass(ConanAwsApiGatewayStage, [{
		key: "initialize",
		value: function initialize(conan, name) {
			this.conan = conan;

			this.parameters("name", "description");

			this.name(name);

			this.conan.steps.add(_findApiStageByNameStep2.default, this);
			this.conan.steps.add(_updateApiStageStep2.default, this);
			this.conan.steps.add(_createApiStageStep2.default, this);
		}
	}, {
		key: "api",
		value: function api(name) {
			return new _conanAwsApiGateway2.default(this.conan, name);
		}
	}, {
		key: "get",
		value: function get(path) {
			return new _conanAwsApiGatewayResource2.default(this.conan, path, "GET");
		}
	}, {
		key: "post",
		value: function post(path) {
			return new _conanAwsApiGatewayResource2.default(this.conan, path, "POST");
		}
	}, {
		key: "put",
		value: function put(path) {
			return new _conanAwsApiGatewayResource2.default(this.conan, path, "PUT");
		}
	}, {
		key: "delete",
		value: function _delete(path) {
			return new _conanAwsApiGatewayResource2.default(this.conan, path, "DELETE");
		}
	}, {
		key: "options",
		value: function options(path) {
			return new _conanAwsApiGatewayResource2.default(this.conan, path, "OPTIONS");
		}
	}]);

	return ConanAwsApiGatewayStage;
}(_conanComponent2.default);

exports.default = ConanAwsApiGatewayStage;