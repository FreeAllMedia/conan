"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _conanJs = require("../../../../conan.js");

var _conanJs2 = _interopRequireDefault(_conanJs);

var _stepsUpsertLambdaStepJs = require("../../steps/upsertLambdaStep.js");

var _stepsUpsertLambdaStepJs2 = _interopRequireDefault(_stepsUpsertLambdaStepJs);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _temp = require("temp");

var _temp2 = _interopRequireDefault(_temp);

var _unzip2 = require("unzip2");

var _unzip22 = _interopRequireDefault(_unzip2);

_temp2["default"].track();

describe(".upsertLambdaStep(conan, context, stepDone)", function () {
	var conan = undefined,
	    context = undefined,
	    stepDone = undefined,
	    createFunctionError = undefined,
	    createFunctionData = undefined,
	    updateFunctionCodeError = undefined,
	    updateFunctionCodeData = undefined,
	    updateFunctionConfigurationError = undefined,
	    updateFunctionConfigurationData = undefined,
	    stepReturnError = undefined,
	    stepReturnData = undefined,
	    parameters = undefined;

	var mockLambda = {
		createFunction: _sinon2["default"].spy(function (params, callback) {
			callback(createFunctionError, createFunctionData);
		}),
		updateFunctionCode: _sinon2["default"].spy(function (params, callback) {
			callback(updateFunctionCodeError, updateFunctionCodeData);
		}),
		updateFunctionConfiguration: _sinon2["default"].spy(function (params, callback) {
			callback(updateFunctionConfigurationError, updateFunctionConfigurationData);
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

		var roleArn = "arn:aws:lambda:us-east-1:123895237541:role:SomeRole";
		var lambdaZipFilePath = __dirname + "/fixtures/lambda.zip";
		var lambdaArn = "arn:aws:lambda:us-east-1:123895237541:function:SomeLambda";

		parameters = {
			Code: {
				ZipFile: _fs2["default"].readFileSync(lambdaZipFilePath)
			},
			FunctionName: "TestFunction",
			Handler: "lambda.handler",
			Role: roleArn,
			Runtime: "nodejs",
			Description: "This is my Lambda!",
			MemorySize: 128,
			Publish: true,
			Timeout: 3
		};

		context = {
			parameters: parameters,
			dependencies: { AWS: MockAWS },
			results: {
				lambdaZipFilePath: lambdaZipFilePath,
				roleArn: roleArn,
				lambdaArn: lambdaArn
			}
		};

		updateFunctionCodeData = {
			FunctionArn: lambdaArn
		};
		updateFunctionCodeError = null;

		updateFunctionConfigurationData = {
			FunctionArn: lambdaArn
		};
		updateFunctionConfigurationError = null;

		createFunctionData = {
			FunctionArn: lambdaArn
		};
		createFunctionError = null;

		stepDone = function (afterStepCallback) {
			return function (error, data) {
				stepReturnError = error;
				stepReturnData = data;
				afterStepCallback();
			};
		};

		(0, _stepsUpsertLambdaStepJs2["default"])(conan, context, stepDone(done));
	});

	afterEach(function (done) {
		_temp2["default"].cleanup(done);
	});

	it("should be a function", function () {
		(typeof _stepsUpsertLambdaStepJs2["default"]).should.equal("function");
	});

	it("should set the designated region on the lambda client", function () {
		MockAWS.Lambda.calledWith({
			region: conan.config.region
		}).should.be["true"];
	});

	describe("(When Lambda is NOT New)", function () {
		it("should call AWS to update the lambda configuration with the designated parameters", function () {
			var updateConfigurationParameters = {
				FunctionName: parameters.FunctionName,
				Handler: parameters.Handler,
				Role: parameters.Role,
				Description: parameters.Description,
				MemorySize: parameters.MemorySize,
				Timeout: parameters.Timeout
			};
			mockLambda.updateFunctionConfiguration.firstCall.args[0].should.eql(updateConfigurationParameters);
		});

		it("should call AWS to update the lambda with the designated code", function () {
			var updateCodeParameters = {
				ZipFile: parameters.Code.ZipFile,
				FunctionName: parameters.FunctionName,
				Publish: parameters.Publish
			};
			mockLambda.updateFunctionCode.firstCall.args[0].should.eql(updateCodeParameters);
		});

		describe("(Lambda is Updated)", function () {
			beforeEach(function (done) {
				updateFunctionConfigurationData = {
					FunctionArn: createFunctionData.FunctionArn
				};
				(0, _stepsUpsertLambdaStepJs2["default"])(conan, context, stepDone(done));
			});

			it("should return the lambda Amazon Resource Name", function () {
				stepReturnData.should.eql({
					lambdaArn: updateFunctionConfigurationData.FunctionArn
				});
			});
		});

		describe("(Lambda Code is NOT Updated)", function () {
			beforeEach(function () {
				updateFunctionCodeError = new Error();
				updateFunctionCodeError.statusCode = 400;
			});

			it("should throw an error", function () {
				(function () {
					(0, _stepsUpsertLambdaStepJs2["default"])(conan, context);
				}).should["throw"]();
			});
		});

		describe("(Lambda Configuration is NOT Updated)", function () {
			beforeEach(function () {
				updateFunctionConfigurationError = new Error();
				updateFunctionConfigurationError.statusCode = 400;
			});

			it("should throw an error", function () {
				(function () {
					(0, _stepsUpsertLambdaStepJs2["default"])(conan, context);
				}).should["throw"]();
			});
		});
	});

	describe("(When Lambda is New)", function () {
		beforeEach(function (done) {
			delete context.results.lambdaArn;
			(0, _stepsUpsertLambdaStepJs2["default"])(conan, context, stepDone(done));
		});

		it("should call AWS with the designated lambda parameters", function () {
			mockLambda.createFunction.firstCall.args[0].should.eql(parameters);
		});

		describe("(Lambda is Created)", function () {
			it("should return the lambda Amazon Resource Name", function () {
				stepReturnData.should.eql({
					lambdaArn: createFunctionData.FunctionArn
				});
			});
		});

		describe("(Lambda is NOT Created)", function () {
			beforeEach(function () {
				createFunctionError = new Error();
				createFunctionError.statusCode = 400;
			});

			it("should throw an error", function () {
				(function () {
					(0, _stepsUpsertLambdaStepJs2["default"])(conan, context);
				}).should["throw"]();
			});
		});
	});
});