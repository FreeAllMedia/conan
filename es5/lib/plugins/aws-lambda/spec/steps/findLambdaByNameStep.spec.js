"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _conanJs = require("../../../../conan.js");

var _conanJs2 = _interopRequireDefault(_conanJs);

var _stepsFindLambdaByNameStepJs = require("../../steps/findLambdaByNameStep.js");

var _stepsFindLambdaByNameStepJs2 = _interopRequireDefault(_stepsFindLambdaByNameStepJs);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

describe(".findLambdaByNameStep(conan, context, stepDone)", function () {
	var conan = undefined,
	    context = undefined,
	    stepDone = undefined,
	    awsResponseError = undefined,
	    awsResponseData = undefined,
	    stepReturnError = undefined,
	    stepReturnData = undefined;

	var mockLambda = {
		getFunction: _sinon2["default"].spy(function (params, callback) {
			callback(awsResponseError, awsResponseData);
		})
	};

	var MockAWS = {
		Lambda: _sinon2["default"].spy(function () {
			return mockLambda;
		})
	};

	beforeEach(function (done) {
		conan = new _conanJs2["default"]({
			region: "us-east-1"
		});

		context = {
			parameters: {
				name: "Conan"
			},
			dependencies: { AWS: MockAWS },
			results: {}
		};

		// "Lambda Found" response by default
		awsResponseData = {
			Configuration: {
				FunctionArn: "arn:aws:lambda:us-east-1:123895237541:function:SomeLambda"
			},
			Code: {}
		};
		awsResponseError = null;

		stepDone = function (afterStepCallback) {
			return function (error, data) {
				stepReturnError = error;
				stepReturnData = data;
				afterStepCallback();
			};
		};

		(0, _stepsFindLambdaByNameStepJs2["default"])(conan, context, stepDone(done));
	});

	it("should be a function", function () {
		(typeof _stepsFindLambdaByNameStepJs2["default"]).should.equal("function");
	});

	it("should set the designated region on the lambda client", function () {
		MockAWS.Lambda.calledWith({
			region: conan.config.region
		}).should.be["true"];
	});

	it("should call AWS with the designated lambda name parameter", function () {
		mockLambda.getFunction.calledWith({
			FunctionName: context.parameters.name
		}).should.be["true"];
	});

	describe("(Lambda is Found)", function () {
		it("should return the found lambda id", function () {
			stepReturnData.should.eql({
				lambdaArn: awsResponseData.Configuration.FunctionArn
			});
		});
	});

	describe("(Lambda is not Found)", function () {
		beforeEach(function (done) {
			awsResponseError = { statusCode: 404 };
			(0, _stepsFindLambdaByNameStepJs2["default"])(conan, context, stepDone(done));
		});

		it("should return the lambda arn as null", function () {
			var expectedData = { lambdaArn: null };
			stepReturnData.should.eql(expectedData);
		});
	});

	describe("(Unknown Error is Returned)", function () {
		var errorMessage = undefined;

		beforeEach(function (done) {
			errorMessage = "AWS returned status code 401";
			awsResponseError = { statusCode: 401, message: errorMessage };
			(0, _stepsFindLambdaByNameStepJs2["default"])(conan, context, stepDone(done));
		});

		it("should return an error which stops the step runner", function () {
			stepReturnError.message.should.eql(errorMessage);
		});
	});
});