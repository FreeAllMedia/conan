"use strict";

var _conan = require("../../../../conan.js");

var _conan2 = _interopRequireDefault(_conan);

var _conanAwsLambda = require("../../components/conanAwsLambda.js");

var _conanAwsLambda2 = _interopRequireDefault(_conanAwsLambda);

var _conanComponent = require("../../../../components/conanComponent.js");

var _conanComponent2 = _interopRequireDefault(_conanComponent);

var _jargon = require("jargon");

var _jargon2 = _interopRequireDefault(_jargon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("ConanAwsLambda(conan, name, filePath, role)", function () {
	var lambda = undefined;
	var name = undefined;
	var filePath = undefined;
	var role = undefined;
	var conan = undefined;

	beforeEach(function () {
		name = "AccountCreate";
		filePath = "/account/create.js";
		role = "SomeRole";

		conan = new _conan2.default();
		lambda = new _conanAwsLambda2.default(conan, name, filePath, role);
	});

	it("should extend ConanComponent", function () {
		lambda.should.be.instanceOf(_conanComponent2.default);
	});

	it("should save conan to .conan", function () {
		lambda.conan.should.eql(conan);
	});

	it("should save name to .name()", function () {
		lambda.name().should.eql(name);
	});

	it("should save filePath to .filePath()", function () {
		lambda.filePath().should.eql(filePath);
	});

	it("should save role to .role()", function () {
		lambda.role().should.eql(role);
	});

	describe("(parameters)", function () {
		["name", "filePath", "role", "runtime", "description", "memorySize", "timeout", "publish", "packages", "bucket"].forEach(function (parameterName) {
			var parameterNamePascalCase = (0, _jargon2.default)(parameterName).pascal.toString();

			describe("." + parameterName + "(new" + parameterNamePascalCase + ")", function describeComponentParameter() {
				it("should save new" + parameterNamePascalCase, function itShouldSaveComponentParameter() {
					var component = new _conanAwsLambda2.default(conan);
					var testValue = "abc123";
					component = component[parameterName](testValue);
					component[parameterName]().should.eql(testValue);
				});
			});
		});
	});

	describe("(multiple-value parameters)", function () {
		["handler"].forEach(function (parameterName) {
			var parameterNamePascalCase = (0, _jargon2.default)(parameterName).pascal.toString();

			describe("." + parameterName + "(new" + parameterNamePascalCase + ")", function () {
				it("should save new" + parameterNamePascalCase, function () {
					var component = new _conanAwsLambda2.default(conan);
					var testValueOne = "abc123";
					var testValueTwo = "abc123";
					component = component[parameterName](testValueOne, testValueTwo);
					component[parameterName]().should.eql([testValueOne, testValueTwo]);
				});
			});
		});
	});

	describe("(multiple-value-aggregate parameters)", function () {
		["dependencies", "alias"].forEach(function (parameterName) {
			var parameterNamePascalCase = (0, _jargon2.default)(parameterName).pascal.toString();

			describe("." + parameterName + "(new" + parameterNamePascalCase + ")", function () {
				it("should save new" + parameterNamePascalCase, function () {
					var component = new _conanAwsLambda2.default(conan);

					var testValueOne = "abc123";
					var testValueTwo = "123abc";
					var testValueThree = "1a2b3c";
					var testValueFour = "c1b2a3";

					component = component[parameterName](testValueOne, testValueTwo);
					component = component[parameterName](testValueThree, testValueFour);

					component[parameterName]().should.eql([[testValueOne, testValueTwo], [testValueThree, testValueFour]]);
				});
			});
		});
	});

	describe("(default values)", function () {
		it("should set the handler to 'handler' by default", function () {
			lambda = new _conanAwsLambda2.default(conan, name, filePath);
			lambda.handler().should.eql(["handler"]);
		});
		it("should set the runtime to 'nodejs' by default", function () {
			lambda.runtime().should.eql("nodejs");
		});
		it("should set the memorySize to '128' by default", function () {
			lambda.memorySize().should.eql(128);
		});
		it("should set the timeout to '3' by default", function () {
			lambda.timeout().should.eql(3);
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

		it("should add a create role step", function () {
			var step = conan.steps.findByName("createRoleStep");
			step.parameters.should.eql(lambda);
		});

		it("should add a attach role policy step", function () {
			var step = conan.steps.findByName("attachRolePolicyStep");
			step.parameters.should.eql(lambda);
		});

		it("should add a compile packages step", function () {
			var step = conan.steps.findByName("buildPackageStep");
			step.parameters.should.eql(lambda);
		});

		it("should add compile lambda zip step", function () {
			var step = conan.steps.findByName("compileLambdaZipStep");
			step.parameters.should.eql(lambda);
		});

		it("should add an upsert lambda step", function () {
			var step = conan.steps.findByName("upsertLambdaStep");
			step.parameters.should.eql(lambda);
		});

		it("should add an publish lambda version step", function () {
			var step = conan.steps.findByName("publishLambdaVersionStep");
			step.parameters.should.eql(lambda);
		});

		it("should add an find lambda alias step", function () {
			var step = conan.steps.findByName("findLambdaAliasStep");
			step.parameters.should.eql(lambda);
		});

		it("should add an create lambda alias step", function () {
			var step = conan.steps.findByName("createLambdaAliasStep");
			step.parameters.should.eql(lambda);
		});

		it("should add an update lambda alias step", function () {
			var step = conan.steps.findByName("updateLambdaAliasStep");
			step.parameters.should.eql(lambda);
		});
	});

	describe(".lambda(name)", function () {
		beforeEach(function () {
			name = "MyLambda";

			lambda = lambda.lambda(name);
		});

		it("should return an instance of ConanAwsLambda", function () {
			lambda.should.be.instanceOf(_conanAwsLambda2.default);
		});

		it("should pass conan to the ConanAwsLambda constructor", function () {
			lambda.conan.should.eql(conan);
		});

		it("should pass the lambda name to the ConanAwsLambda constructor", function () {
			lambda.name().should.eql(name);
		});
	});
});