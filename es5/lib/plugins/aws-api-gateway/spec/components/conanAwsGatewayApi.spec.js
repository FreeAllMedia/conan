"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _conanJs = require("../../../../conan.js");

var _conanJs2 = _interopRequireDefault(_conanJs);

var _componentsConanAwsApiGatewayJs = require("../../components/conanAwsApiGateway.js");

var _componentsConanAwsApiGatewayJs2 = _interopRequireDefault(_componentsConanAwsApiGatewayJs);

var _componentsConanAwsApiGatewayStageJs = require("../../components/conanAwsApiGatewayStage.js");

var _componentsConanAwsApiGatewayStageJs2 = _interopRequireDefault(_componentsConanAwsApiGatewayStageJs);

var _componentsConanComponentJs = require("../../../../components/conanComponent.js");

var _componentsConanComponentJs2 = _interopRequireDefault(_componentsConanComponentJs);

var _jargon = require("jargon");

var _jargon2 = _interopRequireDefault(_jargon);

describe("ConanAwsApiGateway(conan, name)", function () {
	var api = undefined;
	var name = undefined;
	var conan = undefined;

	beforeEach(function () {
		name = "MyAPI";

		conan = new _conanJs2["default"]();
		api = new _componentsConanAwsApiGatewayJs2["default"](conan, name);
	});

	it("should extend ConanComponent", function () {
		api.should.be.instanceOf(_componentsConanComponentJs2["default"]);
	});

	it("should save conan to .conan", function () {
		api.conan.should.eql(conan);
	});

	describe("(parameters)", function () {
		["name"].forEach(function (parameterName) {
			var parameterNamePascalCase = (0, _jargon2["default"])(parameterName).pascal.toString();

			describe("." + parameterName + "(new" + parameterNamePascalCase + ")", function () {
				it("should save new" + parameterNamePascalCase, function () {
					var component = new _componentsConanAwsApiGatewayJs2["default"](conan);
					var testValue = "abc123";
					component = component[parameterName](testValue);
					component[parameterName]().should.eql(testValue);
				});
			});
		});
	});

	describe("(steps)", function () {
		it("should add a find api by name step", function () {
			var step = conan.steps.findByName("findApiByNameStep");
			step.parameters.should.eql(api);
		});

		it("should add a update api step", function () {
			var step = conan.steps.findByName("updateApiStep");
			step.parameters.should.eql(api);
		});

		it("should add a create api step", function () {
			var step = conan.steps.findByName("createApiStep");
			step.parameters.should.eql(api);
		});
	});

	describe("api.stage(name)", function () {
		var stage = undefined;

		beforeEach(function () {
			name = "MyStage";

			stage = api.stage(name);
		});

		it("should return an instance of ConanAwsApiGatewayStage", function () {
			stage.should.be.instanceOf(_componentsConanAwsApiGatewayStageJs2["default"]);
		});

		it("should pass conan to the ConanAwsApiGatewayStage constructor", function () {
			stage.conan.should.eql(conan);
		});

		it("should pass the stage name to the ConanAwsApiGateway constructor", function () {
			stage.name().should.eql(name);
		});
	});

	describe("api.api(name)", function () {
		beforeEach(function () {
			name = "MyAPI";

			api = api.api(name);
		});

		it("should return an instance of ConanAwsApiGateway", function () {
			api.should.be.instanceOf(_componentsConanAwsApiGatewayJs2["default"]);
		});

		it("should pass conan to the ConanAwsApiGateway constructor", function () {
			api.conan.should.eql(conan);
		});

		it("should pass the api name to the ConanAwsApiGateway constructor", function () {
			api.name().should.eql(name);
		});
	});
});