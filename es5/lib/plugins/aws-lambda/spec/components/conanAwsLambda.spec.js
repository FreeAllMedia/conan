"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _conanJs = require("../../../../conan.js");

var _conanJs2 = _interopRequireDefault(_conanJs);

var _componentsConanAwsLambdaJs = require("../../components/conanAwsLambda.js");

var _componentsConanAwsLambdaJs2 = _interopRequireDefault(_componentsConanAwsLambdaJs);

var _componentsConanComponentJs = require("../../../../components/conanComponent.js");

var _componentsConanComponentJs2 = _interopRequireDefault(_componentsConanComponentJs);

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

	it("should save conan to .parameters.conan", function () {
		lambda.conan.should.eql(conan);
	});

	it("should save name to .parameters.name", function () {
		lambda.parameters.name.should.eql(name);
	});

	it("should save filePath to .parameters.filePath", function () {
		lambda.parameters.filePath.should.eql(filePath);
	});

	it("should save handler to .parameters.handler", function () {
		lambda.parameters.handler.should.eql(handler);
	});
});