"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _conanJs = require("../../../../conan.js");

var _conanJs2 = _interopRequireDefault(_conanJs);

var _componentsConanAwsGatewayApiJs = require("../../components/conanAwsGatewayApi.js");

var _componentsConanAwsGatewayApiJs2 = _interopRequireDefault(_componentsConanAwsGatewayApiJs);

var _componentsConanAwsGatewayApiStageJs = require("../../components/conanAwsGatewayApiStage.js");

var _componentsConanAwsGatewayApiStageJs2 = _interopRequireDefault(_componentsConanAwsGatewayApiStageJs);

var _componentsConanComponentJs = require("../../../../components/conanComponent.js");

var _componentsConanComponentJs2 = _interopRequireDefault(_componentsConanComponentJs);

var _jargon = require("jargon");

var _jargon2 = _interopRequireDefault(_jargon);

describe("ConanAwsGatewayApiStage(conan, name)", function () {
	var stage = undefined;
	var name = undefined;
	var conan = undefined;

	beforeEach(function () {
		name = "MyAPI";

		conan = new _conanJs2["default"]();
		stage = new _componentsConanAwsGatewayApiStageJs2["default"](conan, name);
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
					var component = new _componentsConanAwsGatewayApiStageJs2["default"](conan);
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

		it("should return an instance of ConanAwsGatewayApi", function () {
			newApi.should.be.instanceOf(_componentsConanAwsGatewayApiJs2["default"]);
		});

		it("should pass conan to the ConanAwsGatewayApi constructor", function () {
			newApi.conan.should.eql(conan);
		});

		it("should pass the api name to the ConanAwsGatewayApi constructor", function () {
			newApi.name().should.eql(name);
		});
	});
});