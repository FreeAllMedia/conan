"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _componentsConanStepsJs = require("../../../../components/conanSteps.js");

var _componentsConanStepsJs2 = _interopRequireDefault(_componentsConanStepsJs);

var _stepsFindLambdaByNameStepJs = require("../../steps/findLambdaByNameStep.js");

var _stepsFindLambdaByNameStepJs2 = _interopRequireDefault(_stepsFindLambdaByNameStepJs);

describe("findLambdaByNameStep", function () {
	var getFunctionSpy = undefined,
	    conan = undefined,
	    context = undefined,
	    should = undefined;

	before(function (done) {
		should = _chai2["default"].should();
		context = {
			parameters: {
				name: "test Lambda"
			},
			dependencies: {
				aws: {
					getFunction: function getFunction(params, callback) {
						getFunctionSpy(params, callback);
					}
				}
			}
		};
		conan = { config: { "region": "us-east-1" }
		};
		(0, _stepsFindLambdaByNameStepJs2["default"])(conan, context, function () {
			done();
		});
	});

	it("should be a function", function () {
		(typeof _stepsFindLambdaByNameStepJs2["default"]).should.equal("function");
	});

	describe("(parameters)", function () {
		xit("should send the appropiate parameters to the AWS get function call", function () {
			getFunctionSpy.firstCall.args[0].should.eql(expectedFunctionParameters);
		});

		xit("should set the constructor parameters", function () {
			constructorSpy.firstCall.args[0].should.eql(expectedConstructorParameters);
		});
	});

	describe("(lambda not found)", function () {
		xit("should return false for that lambda", function (done) {
			(0, _stepsFindLambdaByNameStepJs2["default"])(conan, context, function (error, result) {
				result.lambda.found.should.equal(false);
				done();
			});
		});
	});

	describe("(lambda found)", function () {
		xit("should return true for that lambda", function (done) {
			(0, _stepsFindLambdaByNameStepJs2["default"])(conan, context, function (error, result) {
				result.lambda.found.should.equal(true);
				done();
			});
		});

		xit("should return the response data for the lambda", function (done) {
			(0, _stepsFindLambdaByNameStepJs2["default"])(conan, context, function (error, result) {
				result.lambda.response.should.eql(responseData);
				done();
			});
		});
	});

	describe("(unknown error)", function () {
		xit("should return error", function (done) {
			(0, _stepsFindLambdaByNameStepJs2["default"])(conan, context, function (error) {
				should.exist(error);
				done();
			});
		});
	});
});