"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _conanJs = require("../../../../conan.js");

var _conanJs2 = _interopRequireDefault(_conanJs);

var _stepsFindLambdaByNameStepJs = require("../../steps/findLambdaByNameStep.js");

var _stepsFindLambdaByNameStepJs2 = _interopRequireDefault(_stepsFindLambdaByNameStepJs);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

describe(".findLambdaByNameStep(event, context, stepDone)", function () {
	var conan = undefined,
	    conanConfig = undefined,
	    stepParameters = undefined,
	    awsError = undefined,
	    awsData = undefined,
	    stepReturnData = undefined,
	    context = undefined;

	var lambdaClient = {
		getFunction: _sinon2["default"].spy(function (params, callback) {
			callback(awsError, awsData);
		})
	};

	function newLambdaClient() {
		return lambdaClient;
	}

	var AWS = {
		Lambda: _sinon2["default"].spy(newLambdaClient)
	};

	beforeEach(function (done) {
		awsError = null;
		awsData = {
			Configuration: {
				FunctionArn: "arn:aws:lambda:us-east-1:166191841105:function:SomeLambda"
			}, Code: {}
		};

		conanConfig = {
			region: "us-east-1"
		};
		conan = new _conanJs2["default"](conanConfig);

		stepParameters = {
			name: "SomeLambda"
		};

		context = {
			parameters: stepParameters,
			dependencies: { AWS: AWS },
			results: {}
		};

		(0, _stepsFindLambdaByNameStepJs2["default"])(conan, context, function (error, data) {
			stepReturnData = data;
			done();
		});
	});

	it("should be a function", function () {
		(typeof _stepsFindLambdaByNameStepJs2["default"]).should.equal("function");
	});

	it("should set the designated region on the lambda client", function () {
		AWS.Lambda.calledWith({
			region: conanConfig.region
		}).should.be["true"];
	});

	it("should call AWS with the designated function name parameter", function () {
		lambdaClient.getFunction.calledWith({
			FunctionName: stepParameters.name
		}).should.be["true"];
	});

	describe("(Lambda is Found)", function () {
		beforeEach(function (done) {
			(0, _stepsFindLambdaByNameStepJs2["default"])(conan, context, function (error, data) {
				stepReturnData = data;
				done();
			});
		});

		it("should return the found lambda id", function () {
			stepReturnData.should.eql({
				lambda: {
					id: awsData.Configuration.FunctionArn
				}
			});
		});
	});

	describe("(Lambda is not Found)", function () {
		beforeEach(function (done) {
			awsError = { statusCode: 404 };
			(0, _stepsFindLambdaByNameStepJs2["default"])(conan, context, function (error, data) {
				stepReturnData = data;
				done();
			});
		});

		it("should return the lambda id as null", function () {
			stepReturnData.should.eql({
				lambda: {
					id: null
				}
			});
		});
	});

	describe("(Unknown Error is Returned)", function () {
		it("should return an error which stops the step runner", function (done) {
			var errorMessage = "AWS returned status code 401";
			awsError = { statusCode: 401, message: errorMessage };
			(0, _stepsFindLambdaByNameStepJs2["default"])(conan, context, function (error) {
				error.message.should.eql(errorMessage);
				done();
			});
		});
	});
});