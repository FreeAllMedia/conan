"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _conanJs = require("../../../../conan.js");

var _conanJs2 = _interopRequireDefault(_conanJs);

var _componentsConanAwsApiGatewayResourceJs = require("../../components/conanAwsApiGatewayResource.js");

var _componentsConanAwsApiGatewayResourceJs2 = _interopRequireDefault(_componentsConanAwsApiGatewayResourceJs);

var _stepsFindApiStageByNameStepJs = require("../../steps/findApiStageByNameStep.js");

var _stepsFindApiStageByNameStepJs2 = _interopRequireDefault(_stepsFindApiStageByNameStepJs);

var _awsLambdaStepsFindLambdaByNameStepJs = require("../../../aws-lambda/steps/findLambdaByNameStep.js");

var _awsLambdaStepsFindLambdaByNameStepJs2 = _interopRequireDefault(_awsLambdaStepsFindLambdaByNameStepJs);

var _componentsConanComponentJs = require("../../../../components/conanComponent.js");

var _componentsConanComponentJs2 = _interopRequireDefault(_componentsConanComponentJs);

var _jargon = require("jargon");

var _jargon2 = _interopRequireDefault(_jargon);

describe("ConanAwsApiGatewayResource(conan)", function () {
	var apiResource = undefined;
	var path = undefined;
	var method = undefined;
	var conan = undefined;

	beforeEach(function () {
		path = "/account";
		method = "GET";

		conan = new _conanJs2["default"]();
		apiResource = new _componentsConanAwsApiGatewayResourceJs2["default"](conan, path, method);
	});

	it("should extend ConanComponent", function () {
		apiResource.should.be.instanceOf(_componentsConanComponentJs2["default"]);
	});

	it("should save conan to .conan", function () {
		apiResource.conan.should.eql(conan);
	});

	describe("(parameters)", function () {
		["path", "method", "lambda", "statusCodes", "responseHeaders"].forEach(function (parameterName) {
			var parameterNamePascalCase = (0, _jargon2["default"])(parameterName).pascal.toString();

			describe("." + parameterName + "(new" + parameterNamePascalCase + ")", function () {
				it("should save new" + parameterNamePascalCase, function () {
					var component = new _componentsConanAwsApiGatewayResourceJs2["default"](conan);
					var testValue = "abc123";
					component = component[parameterName](testValue);
					component[parameterName]().should.eql(testValue);
				});
			});
		});
	});

	describe("(multiple-value parameters)", function () {
		["headers", "queryStrings"].forEach(function (parameterName) {
			var parameterNamePascalCase = (0, _jargon2["default"])(parameterName).pascal.toString();

			describe("." + parameterName + "(new" + parameterNamePascalCase + ")", function () {
				it("should save new" + parameterNamePascalCase, function () {
					var component = new _componentsConanAwsApiGatewayResourceJs2["default"](conan);
					var testValueOne = "abc123";
					var testValueTwo = "abc123";
					component = component[parameterName](testValueOne, testValueTwo);
					component[parameterName]().should.eql([testValueOne, testValueTwo]);
				});
			});
		});
	});

	describe("(steps)", function () {
		describe("(step order)", function () {
			beforeEach(function () {
				conan = new _conanJs2["default"]();
				conan.steps.add(_stepsFindApiStageByNameStepJs2["default"], {});
				apiResource = new _componentsConanAwsApiGatewayResourceJs2["default"](conan, path, method);
			});

			it("should insert all his steps before the find stage component step", function () {
				conan.steps.all.pop().handler.should.equal(_stepsFindApiStageByNameStepJs2["default"]);
			});

			it("should insert the find lambda step at first", function () {
				conan.steps.all.shift().handler.should.equal(_awsLambdaStepsFindLambdaByNameStepJs2["default"]);
			});
		});

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

		it("should add a find lambda by name step", function () {
			var step = conan.steps.findByName("findLambdaByNameStep");
			step.parameters.should.eql(apiResource);
		});

		it("should add a put integration step", function () {
			var step = conan.steps.findByName("putIntegrationStep");
			step.parameters.should.eql(apiResource);
		});

		it("should add a put integration response step", function () {
			var step = conan.steps.findByName("putIntegrationResponseStep");
			step.parameters.should.eql(apiResource);
		});

		it("should add a find method response step", function () {
			var step = conan.steps.findByName("findMethodResponseStep");
			step.parameters.should.eql(apiResource);
		});

		it("should add a put method response step", function () {
			var step = conan.steps.findByName("putMethodResponseStep");
			step.parameters.should.eql(apiResource);
		});

		it("should add a add permission step", function () {
			var step = conan.steps.findByName("addPermissionStep");
			step.parameters.should.eql(apiResource);
		});

		it("should add a get account id step", function () {
			var step = conan.steps.findByName("getAccountIdStep");
			step.parameters.should.eql(apiResource);
		});
	});

	["GET", "POST", "PUT", "DELETE", "OPTIONS"].forEach(function (resourceMethod) {
		var methodFunctionName = resourceMethod.toLowerCase();
		describe("apiResource." + methodFunctionName + "(path)", function () {
			var newResource = undefined;
			beforeEach(function () {
				path = "/testResource";
				method = resourceMethod;

				newResource = _componentsConanAwsApiGatewayResourceJs2["default"].prototype[methodFunctionName].call(apiResource, path);
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