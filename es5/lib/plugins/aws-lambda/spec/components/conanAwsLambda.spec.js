"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _conanJs = require("../../../../conan.js");

var _conanJs2 = _interopRequireDefault(_conanJs);

var _componentsConanAwsLambdaJs = require("../../components/conanAwsLambda.js");

var _componentsConanAwsLambdaJs2 = _interopRequireDefault(_componentsConanAwsLambdaJs);

var _componentsConanComponentJs = require("../../../../components/conanComponent.js");

var _componentsConanComponentJs2 = _interopRequireDefault(_componentsConanComponentJs);

var _specHelpersTestComponentParametersJs = require("../../../../../spec/helpers/testComponentParameters.js");

var _specHelpersTestComponentParametersJs2 = _interopRequireDefault(_specHelpersTestComponentParametersJs);

describe("ConanAwsLambda(conan, name, filePath, handler)", function () {
	var lambda = undefined;
	var conan = undefined;
	var name = undefined;
	var filePath = undefined;
	var handler = undefined;

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
		(0, _specHelpersTestComponentParametersJs2["default"])(_componentsConanAwsLambdaJs2["default"], ["name", "filePath", "handler", "runtime", "role", "description", "memorySize", "timeout", "publish"]);
	});
});