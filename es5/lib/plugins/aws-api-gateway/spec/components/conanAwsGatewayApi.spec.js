"use strict";

var _conan = require("../../../../conan.js");

var _conan2 = _interopRequireDefault(_conan);

var _conanAwsApiGateway = require("../../components/conanAwsApiGateway.js");

var _conanAwsApiGateway2 = _interopRequireDefault(_conanAwsApiGateway);

var _conanAwsApiGatewayStage = require("../../components/conanAwsApiGatewayStage.js");

var _conanAwsApiGatewayStage2 = _interopRequireDefault(_conanAwsApiGatewayStage);

var _conanComponent = require("../../../../components/conanComponent.js");

var _conanComponent2 = _interopRequireDefault(_conanComponent);

var _jargon = require("jargon");

var _jargon2 = _interopRequireDefault(_jargon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("ConanAwsApiGateway(conan, name)", function () {
	var api = undefined;
	var name = undefined;
	var conan = undefined;

	beforeEach(function () {
		name = "MyAPI";

		conan = new _conan2.default();
		api = new _conanAwsApiGateway2.default(conan, name);
	});

	it("should extend ConanComponent", function () {
		api.should.be.instanceOf(_conanComponent2.default);
	});

	it("should save conan to .conan", function () {
		api.conan.should.eql(conan);
	});

	describe("(parameters)", function () {
		["name"].forEach(function (parameterName) {
			var parameterNamePascalCase = (0, _jargon2.default)(parameterName).pascal.toString();

			describe("." + parameterName + "(new" + parameterNamePascalCase + ")", function () {
				it("should save new" + parameterNamePascalCase, function () {
					var component = new _conanAwsApiGateway2.default(conan);
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
			stage.should.be.instanceOf(_conanAwsApiGatewayStage2.default);
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
			api.should.be.instanceOf(_conanAwsApiGateway2.default);
		});

		it("should pass conan to the ConanAwsApiGateway constructor", function () {
			api.conan.should.eql(conan);
		});

		it("should pass the api name to the ConanAwsApiGateway constructor", function () {
			api.name().should.eql(name);
		});
	});
});