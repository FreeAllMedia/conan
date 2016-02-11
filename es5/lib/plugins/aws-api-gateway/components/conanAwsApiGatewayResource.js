"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _conanComponent = require("../../../components/conanComponent.js");

var _conanComponent2 = _interopRequireDefault(_conanComponent);

var _findApiResourceByPathStep = require("../steps/findApiResourceByPathStep.js");

var _findApiResourceByPathStep2 = _interopRequireDefault(_findApiResourceByPathStep);

var _createApiResourcesStep = require("../steps/createApiResourcesStep.js");

var _createApiResourcesStep2 = _interopRequireDefault(_createApiResourcesStep);

var _findResourceMethodStep = require("../steps/findResourceMethodStep.js");

var _findResourceMethodStep2 = _interopRequireDefault(_findResourceMethodStep);

var _createResourceMethodStep = require("../steps/createResourceMethodStep.js");

var _createResourceMethodStep2 = _interopRequireDefault(_createResourceMethodStep);

var _putIntegrationStep = require("../steps/putIntegrationStep.js");

var _putIntegrationStep2 = _interopRequireDefault(_putIntegrationStep);

var _putIntegrationResponseStep = require("../steps/putIntegrationResponseStep.js");

var _putIntegrationResponseStep2 = _interopRequireDefault(_putIntegrationResponseStep);

var _putMethodResponseStep = require("../steps/putMethodResponseStep.js");

var _putMethodResponseStep2 = _interopRequireDefault(_putMethodResponseStep);

var _findMethodResponseStep = require("../steps/findMethodResponseStep.js");

var _findMethodResponseStep2 = _interopRequireDefault(_findMethodResponseStep);

var _addPermissionStep = require("../steps/addPermissionStep.js");

var _addPermissionStep2 = _interopRequireDefault(_addPermissionStep);

var _getAccountIdStep = require("../steps/getAccountIdStep.js");

var _getAccountIdStep2 = _interopRequireDefault(_getAccountIdStep);

var _findLambdaByNameStep = require("../../aws-lambda/steps/findLambdaByNameStep.js");

var _findLambdaByNameStep2 = _interopRequireDefault(_findLambdaByNameStep);

var _findApiStageByNameStep = require("../steps/findApiStageByNameStep.js");

var _findApiStageByNameStep2 = _interopRequireDefault(_findApiStageByNameStep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ConanAwsApiGatewayResource = function (_ConanComponent) {
	_inherits(ConanAwsApiGatewayResource, _ConanComponent);

	function ConanAwsApiGatewayResource() {
		_classCallCheck(this, ConanAwsApiGatewayResource);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(ConanAwsApiGatewayResource).apply(this, arguments));
	}

	_createClass(ConanAwsApiGatewayResource, [{
		key: "initialize",
		value: function initialize(conan, path, method) {
			this.conan = conan;

			this.parameters("path", "method", "statusCodes", "responseHeaders");

			this.multipleValueParameters("lambda", "headers", "queryStrings");

			this.path(path);
			this.method(method);
			this.headers();
			this.queryStrings();
			this.statusCodes({ "200": "" });
			this.responseHeaders({});

			this.conan.steps.before(_findApiStageByNameStep2.default, _findLambdaByNameStep2.default, this);
			this.conan.steps.before(_findApiStageByNameStep2.default, _findApiResourceByPathStep2.default, this);
			this.conan.steps.before(_findApiStageByNameStep2.default, _createApiResourcesStep2.default, this);
			this.conan.steps.before(_findApiStageByNameStep2.default, _findResourceMethodStep2.default, this);
			this.conan.steps.before(_findApiStageByNameStep2.default, _createResourceMethodStep2.default, this);
			this.conan.steps.before(_findApiStageByNameStep2.default, _putIntegrationStep2.default, this);
			this.conan.steps.before(_findApiStageByNameStep2.default, _findMethodResponseStep2.default, this);
			this.conan.steps.before(_findApiStageByNameStep2.default, _putMethodResponseStep2.default, this);
			this.conan.steps.before(_findApiStageByNameStep2.default, _putIntegrationResponseStep2.default, this);
			this.conan.steps.before(_findApiStageByNameStep2.default, _getAccountIdStep2.default, this);
			this.conan.steps.before(_findApiStageByNameStep2.default, _addPermissionStep2.default, this);
		}
	}, {
		key: "get",
		value: function get(path) {
			return new ConanAwsApiGatewayResource(this.conan, path, "GET");
		}
	}, {
		key: "post",
		value: function post(path) {
			return new ConanAwsApiGatewayResource(this.conan, path, "POST");
		}
	}, {
		key: "put",
		value: function put(path) {
			return new ConanAwsApiGatewayResource(this.conan, path, "PUT");
		}
	}, {
		key: "delete",
		value: function _delete(path) {
			return new ConanAwsApiGatewayResource(this.conan, path, "DELETE");
		}
	}, {
		key: "options",
		value: function options(path) {
			return new ConanAwsApiGatewayResource(this.conan, path, "OPTIONS");
		}
	}]);

	return ConanAwsApiGatewayResource;
}(_conanComponent2.default);

exports.default = ConanAwsApiGatewayResource;