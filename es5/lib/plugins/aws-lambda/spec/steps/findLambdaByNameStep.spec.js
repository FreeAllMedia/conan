"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _rewire = require("rewire");

var _rewire2 = _interopRequireDefault(_rewire);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _conanJs = require("../../../../conan.js");

var _conanJs2 = _interopRequireDefault(_conanJs);

var conanFindLambdaByNameStep = (0, _rewire2["default"])("../../steps/findLambdaByNameStep.js");

describe("findLambdaByNameStep", function () {
	var awsSpy = undefined,
	    conan = undefined,
	    context = undefined,
	    should = undefined;

	before(function () {
		should = _chai2["default"].should();
		context = {
			parameters: {
				name: "test Lambda"
			}
		};
		conan = new _conanJs2["default"]({ "region": "us-east-1" });
	});

	it("should be a function", function () {
		(typeof conanFindLambdaByNameStep).should.equal("function");
	});

	describe("(parameters)", function () {
		var revertRewiredConstructor = undefined;
		var expectedFunctionParameters = undefined;
		var expectedConstructorParameters = undefined;
		var constructorSpy = undefined;

		beforeEach(function (done) {
			awsSpy = _sinon2["default"].spy(function (params, callback) {
				callback({ statusCode: 404 });
			});

			expectedFunctionParameters = {
				FunctionName: context.parameters.name
			};

			expectedConstructorParameters = {
				region: "us-east-1"
			};

			constructorSpy = _sinon2["default"].spy();

			revertRewiredConstructor = conanFindLambdaByNameStep.__set__("LambdaConstructor", function (constructorParameters) {
				constructorSpy(constructorParameters);
				return {
					getFunction: awsSpy
				};
			});

			conanFindLambdaByNameStep(conan, context, function () {
				done();
			});
		});

		afterEach(function () {
			revertRewiredConstructor();
		});

		it("should send the ", function () {
			awsSpy.firstCall.args[0].should.eql(expectedFunctionParameters);
		});

		it("should set the constructor parameters", function () {
			constructorSpy.firstCall.args[0].should.eql(expectedConstructorParameters);
		});
	});

	describe("(lambda not found)", function () {
		var revertRewiredConstructor = undefined;

		beforeEach(function () {
			awsSpy = _sinon2["default"].spy(function (params, callback) {
				callback({ statusCode: 404 });
			});

			revertRewiredConstructor = conanFindLambdaByNameStep.__set__("LambdaConstructor", function () {
				return {
					getFunction: awsSpy
				};
			});
		});

		afterEach(function () {
			revertRewiredConstructor();
		});

		it("should return false for that lambda", function (done) {
			conanFindLambdaByNameStep(conan, context, function (error, result) {
				result.lambda.found.should.equal(false);
				done();
			});
		});
	});

	describe("(lambda found)", function () {
		var revertRewiredConstructor = undefined;
		var responseData = undefined;

		beforeEach(function () {
			responseData = { Configuration: {} };
			awsSpy = _sinon2["default"].spy(function (params, callback) {
				callback(null, responseData);
			});

			revertRewiredConstructor = conanFindLambdaByNameStep.__set__("LambdaConstructor", function () {
				return {
					getFunction: awsSpy
				};
			});
		});

		afterEach(function () {
			revertRewiredConstructor();
		});

		it("should return true for that lambda", function (done) {
			conanFindLambdaByNameStep(conan, context, function (error, result) {
				result.lambda.found.should.equal(true);
				done();
			});
		});

		it("should return the response data for the lambda", function (done) {
			conanFindLambdaByNameStep(conan, context, function (error, result) {
				result.lambda.response.should.eql(responseData);
				done();
			});
		});
	});

	describe("(unknown error)", function () {
		var revertRewiredConstructor = undefined;

		beforeEach(function () {
			awsSpy = _sinon2["default"].spy(function (params, callback) {
				callback({ statusCode: 401 });
			});

			revertRewiredConstructor = conanFindLambdaByNameStep.__set__("LambdaConstructor", function () {
				return {
					getFunction: awsSpy
				};
			});
		});

		afterEach(function () {
			revertRewiredConstructor();
		});

		it("should return error", function (done) {
			conanFindLambdaByNameStep(conan, context, function (error) {
				should.exist(error);
				done();
			});
		});
	});
});