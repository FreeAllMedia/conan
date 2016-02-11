"use strict";

var _conan = require("../../../../conan.js");

var _conan2 = _interopRequireDefault(_conan);

var _conanAwsApiGateway = require("../../components/conanAwsApiGateway.js");

var _conanAwsApiGateway2 = _interopRequireDefault(_conanAwsApiGateway);

var _conanAwsApiGatewayStage = require("../../components/conanAwsApiGatewayStage.js");

var _conanAwsApiGatewayStage2 = _interopRequireDefault(_conanAwsApiGatewayStage);

var _conanAwsApiGatewayResource = require("../../components/conanAwsApiGatewayResource.js");

var _conanAwsApiGatewayResource2 = _interopRequireDefault(_conanAwsApiGatewayResource);

var _conanComponent = require("../../../../components/conanComponent.js");

var _conanComponent2 = _interopRequireDefault(_conanComponent);

var _jargon = require("jargon");

var _jargon2 = _interopRequireDefault(_jargon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("ConanAwsApiGatewayStage(conan, name)", function () {
	var stage = undefined;
	var name = undefined;
	var conan = undefined;

	beforeEach(function () {
		name = "MyAPI";

		conan = new _conan2.default();
		stage = new _conanAwsApiGatewayStage2.default(conan, name);
	});

	it("should extend ConanComponent", function () {
		stage.should.be.instanceOf(_conanComponent2.default);
	});

	it("should save conant to stage.conan", function () {
		stage.conan.should.eql(conan);
	});

	describe("(parameters)", function () {
		["name", "description"].forEach(function (parameterName) {
			var parameterNamePascalCase = (0, _jargon2.default)(parameterName).pascal.toString();

			describe("." + parameterName + "(new" + parameterNamePascalCase + ")", function () {
				it("should save new" + parameterNamePascalCase, function () {
					var component = new _conanAwsApiGatewayStage2.default(conan);
					var testValue = "abc123";
					component = component[parameterName](testValue);
					component[parameterName]().should.eql(testValue);
				});
			});
		});
	});

	describe("(steps)", function () {
		it("should add a find api by name step", function () {
			var step = conan.steps.findByName("findApiStageByNameStep");
			step.parameters.should.eql(stage);
		});

		it("should add a create stage step", function () {
			var step = conan.steps.findByName("createApiStageStep");
			step.parameters.should.eql(stage);
		});

		it("should add a update stage step", function () {
			var step = conan.steps.findByName("updateApiStageStep");
			step.parameters.should.eql(stage);
		});
	});

	describe("stage.api(name)", function () {
		var newApi = undefined;

		beforeEach(function () {
			name = "MyAPI";

			newApi = stage.api(name);
		});

		it("should return an instance of ConanAwsApiGateway", function () {
			newApi.should.be.instanceOf(_conanAwsApiGateway2.default);
		});

		it("should pass conan to the ConanAwsApiGateway constructor", function () {
			newApi.conan.should.eql(conan);
		});

		it("should pass the api name to the ConanAwsApiGateway constructor", function () {
			newApi.name().should.eql(name);
		});
	});

	["GET", "POST", "PUT", "DELETE", "OPTIONS"].forEach(function (resourceMethod) {
		var methodFunctionName = resourceMethod.toLowerCase();
		describe("stage." + methodFunctionName + "(path)", function () {
			var newResource = undefined;
			var path = undefined;
			var method = undefined;

			beforeEach(function () {
				path = "/testResource";
				method = resourceMethod;

				newResource = _conanAwsApiGatewayStage2.default.prototype[methodFunctionName].call(stage, path);
			});

			it("should return an instance of ConanAwsApiGatewayResource", function () {
				newResource.should.be.instanceOf(_conanAwsApiGatewayResource2.default);
			});

			it("should pass conan to the ConanAwsApiGatewayResource constructor", function () {
				newResource.conan.should.eql(conan);
			});

			it("should pass the path to the ConanAwsApiGatewayResource constructor", function () {
				newResource.path().should.eql(path);
			});

			it("should pass the method to the ConanAwsApiGatewayResource constructor", function () {
				newResource.method().should.eql(method);
			});
		});
	});
});