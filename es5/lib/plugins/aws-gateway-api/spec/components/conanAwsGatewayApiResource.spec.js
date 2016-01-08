"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _conanJs = require("../../../../conan.js");

var _conanJs2 = _interopRequireDefault(_conanJs);

var _componentsConanAwsGatewayApiResourceJs = require("../../components/conanAwsGatewayApiResource.js");

var _componentsConanAwsGatewayApiResourceJs2 = _interopRequireDefault(_componentsConanAwsGatewayApiResourceJs);

var _componentsConanComponentJs = require("../../../../components/conanComponent.js");

var _componentsConanComponentJs2 = _interopRequireDefault(_componentsConanComponentJs);

var _jargon = require("jargon");

var _jargon2 = _interopRequireDefault(_jargon);

describe("ConanAwsGatewayApiResource(conan)", function () {
	var apiResource = undefined;
	var path = undefined;
	var method = undefined;
	var conan = undefined;

	beforeEach(function () {
		path = "/account";
		method = "GET";

		conan = new _conanJs2["default"]();
		apiResource = new _componentsConanAwsGatewayApiResourceJs2["default"](conan, path, method);
	});

	it("should extend ConanComponent", function () {
		apiResource.should.be.instanceOf(_componentsConanComponentJs2["default"]);
	});

	it("should save conan to .conan", function () {
		apiResource.conan.should.eql(conan);
	});

	describe("(parameters)", function () {
		["path", "method"].forEach(function (parameterName) {
			var parameterNamePascalCase = (0, _jargon2["default"])(parameterName).pascal.toString();

			describe("." + parameterName + "(new" + parameterNamePascalCase + ")", function () {
				it("should save new" + parameterNamePascalCase, function () {
					var component = new _componentsConanAwsGatewayApiResourceJs2["default"](conan);
					var testValue = "abc123";
					component = component[parameterName](testValue);
					component[parameterName]().should.eql(testValue);
				});
			});
		});
	});

	describe("(steps)", function () {
		it("should add a find apiResource by name step", function () {
			var step = conan.steps.findByName("findApiResourceByPathStep");
			step.parameters.should.eql(apiResource);
		});

		it("should add a create api resources step", function () {
			var step = conan.steps.findByName("createApiResourcesStep");
			step.parameters.should.eql(apiResource);
		});

		it("should add a find resource method step", function () {
			var step = conan.steps.findByName("findResourceMethodStep");
			step.parameters.should.eql(apiResource);
		});

		it("should add a create resource method step", function () {
			var step = conan.steps.findByName("createResourceMethodStep");
			step.parameters.should.eql(apiResource);
		});
	});

	["GET", "POST", "PUT", "DELETE"].forEach(function (resourceMethod) {
		var methodFunctionName = resourceMethod.toLowerCase();
		describe("apiResource." + methodFunctionName + "(path)", function () {
			var newResource = undefined;
			beforeEach(function () {
				path = "/testResource";
				method = resourceMethod;

				newResource = _componentsConanAwsGatewayApiResourceJs2["default"].prototype[methodFunctionName].call(apiResource, path);
			});

			it("should return an instance of ConanAwsGatewayApiResource", function () {
				newResource.should.be.instanceOf(_componentsConanAwsGatewayApiResourceJs2["default"]);
			});

			it("should pass conan to the ConanAwsGatewayApiResource constructor", function () {
				newResource.conan.should.eql(conan);
			});

			it("should pass the path to the ConanAwsGatewayApiResource constructor", function () {
				newResource.path().should.eql(path);
			});

			it("should pass the method to the ConanAwsGatewayApiResource constructor", function () {
				newResource.method().should.eql(method);
			});
		});
	});
});