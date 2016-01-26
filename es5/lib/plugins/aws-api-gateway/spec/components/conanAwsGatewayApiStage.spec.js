"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _conanJs = require("../../../../conan.js");

var _conanJs2 = _interopRequireDefault(_conanJs);

var _componentsConanAwsApiGatewayJs = require("../../components/conanAwsApiGateway.js");

var _componentsConanAwsApiGatewayJs2 = _interopRequireDefault(_componentsConanAwsApiGatewayJs);

var _componentsConanAwsApiGatewayStageJs = require("../../components/conanAwsApiGatewayStage.js");

var _componentsConanAwsApiGatewayStageJs2 = _interopRequireDefault(_componentsConanAwsApiGatewayStageJs);

var _componentsConanAwsApiGatewayResourceJs = require("../../components/conanAwsApiGatewayResource.js");

var _componentsConanAwsApiGatewayResourceJs2 = _interopRequireDefault(_componentsConanAwsApiGatewayResourceJs);

var _componentsConanComponentJs = require("../../../../components/conanComponent.js");

var _componentsConanComponentJs2 = _interopRequireDefault(_componentsConanComponentJs);

var _jargon = require("jargon");

var _jargon2 = _interopRequireDefault(_jargon);

describe("ConanAwsApiGatewayStage(conan, name)", function () {
	var stage = undefined;
	var name = undefined;
	var conan = undefined;

	beforeEach(function () {
		name = "MyAPI";

		conan = new _conanJs2["default"]();
		stage = new _componentsConanAwsApiGatewayStageJs2["default"](conan, name);
	});

	it("should extend ConanComponent", function () {
		stage.should.be.instanceOf(_componentsConanComponentJs2["default"]);
	});

	it("should save conant to stage.conan", function () {
		stage.conan.should.eql(conan);
	});

	describe("(parameters)", function () {
		["name", "description"].forEach(function (parameterName) {
			var parameterNamePascalCase = (0, _jargon2["default"])(parameterName).pascal.toString();

			describe("." + parameterName + "(new" + parameterNamePascalCase + ")", function () {
				it("should save new" + parameterNamePascalCase, function () {
					var component = new _componentsConanAwsApiGatewayStageJs2["default"](conan);
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
			newApi.should.be.instanceOf(_componentsConanAwsApiGatewayJs2["default"]);
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

				newResource = _componentsConanAwsApiGatewayStageJs2["default"].prototype[methodFunctionName].call(stage, path);
			});

			it("should return an instance of ConanAwsApiGatewayResource", function () {
				newResource.should.be.instanceOf(_componentsConanAwsApiGatewayResourceJs2["default"]);
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