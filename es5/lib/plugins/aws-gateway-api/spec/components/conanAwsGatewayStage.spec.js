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
	var api = undefined;
	var stage = undefined;
	var name = undefined;
	var conan = undefined;

	beforeEach(function () {
		name = "MyAPI";

		conan = new _conanJs2["default"]();
		api = new _componentsConanAwsGatewayApiJs2["default"](conan, "SomeApi");
		stage = new _componentsConanAwsGatewayApiStageJs2["default"](api, name);
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
					var component = new _componentsConanAwsGatewayApiStageJs2["default"](conan);
					var testValue = "abc123";
					component = component[parameterName](testValue);
					component[parameterName]().should.eql(testValue);
				});
			});
		});
	});

	// describe("(steps)", () => {
	// 	it("should add a find api by name step", () => {
	// 		const step = conan.steps.findByName("findLambdaByNameStep");
	// 		step.parameters.should.eql(api);
	// 	});
	// });
});