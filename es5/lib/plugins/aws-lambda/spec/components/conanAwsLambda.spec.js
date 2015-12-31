"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _conanJs = require("../../../../conan.js");

var _conanJs2 = _interopRequireDefault(_conanJs);

var _componentsConanAwsLambdaJs = require("../../components/conanAwsLambda.js");

var _componentsConanAwsLambdaJs2 = _interopRequireDefault(_componentsConanAwsLambdaJs);

var _componentsConanComponentJs = require("../../../../components/conanComponent.js");

var _componentsConanComponentJs2 = _interopRequireDefault(_componentsConanComponentJs);

var _jargon = require("jargon");

var _jargon2 = _interopRequireDefault(_jargon);

describe("ConanAwsLambda(conan, name, filePath, handler)", function () {
	var lambda = undefined;
	var name = undefined;
	var filePath = undefined;
	var handler = undefined;
	var conan = undefined;

	beforeEach(function () {
		name = "AccountCreate";
		filePath = "/account/create.js";
		handler = "handler";

		conan = new _conanJs2["default"]();
		lambda = new _componentsConanAwsLambdaJs2["default"](conan, name, filePath, handler);
	});

	it("should extend ConanComponent", function () {
		lambda.should.be.instanceOf(_componentsConanComponentJs2["default"]);
	});

	it("should save conan to .conan", function () {
		lambda.conan.should.eql(conan);
	});

	describe("(parameters)", function () {
		["name", "filePath", "handler", "runtime", "role", "description", "memorySize", "timeout", "publish", "packages", "bucket", "key", "dependencies"].forEach(function (parameterName) {
			var parameterNamePascalCase = (0, _jargon2["default"])(parameterName).pascal.toString();

			describe("." + parameterName + "(new" + parameterNamePascalCase + ")", function describeComponentParameter() {
				it("should save new" + parameterNamePascalCase, function itShouldSaveComponentParameter() {
					var component = new _componentsConanAwsLambdaJs2["default"](conan);
					var testValue = "abc123";
					component = component[parameterName](testValue);
					component[parameterName]().should.eql(testValue);
				});
			});
		});
	});

	describe("(steps)", function () {
		it("should add a find lambda by name step", function () {
			var step = conan.steps.findByName("findLambdaByNameStep");
			step.parameters.should.eql(lambda);
		});

		it("should add a find role by name step", function () {
			var step = conan.steps.findByName("findRoleByNameStep");
			step.parameters.should.eql(lambda);
		});

		it("should add a compile dependencies step", function () {
			var step = conan.steps.findByName("compileDependenciesStep");
			step.parameters.should.eql(lambda);
		});

		it("should add compile lambda zip step", function () {
			var step = conan.steps.findByName("compileLambdaZipStep");
			step.parameters.should.eql(lambda);
		});

		it("should add an upsert lambda step step", function () {
			var step = conan.steps.findByName("upsertLambdaStep");
			step.parameters.should.eql(lambda);
		});
	});
});