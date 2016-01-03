"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _conanJs = require("../../../../conan.js");

var _conanJs2 = _interopRequireDefault(_conanJs);

var _stepsUpsertLambdaStepJs = require("../../steps/upsertLambdaStep.js");

var _stepsUpsertLambdaStepJs2 = _interopRequireDefault(_stepsUpsertLambdaStepJs);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _temp = require("temp");

var _temp2 = _interopRequireDefault(_temp);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _jargon = require("jargon");

var _jargon2 = _interopRequireDefault(_jargon);

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
	    parameters = undefined,
	    lambdaZipFilePath = undefined,
	    lambdaFilePath = undefined,
	    roleArn = undefined,
	    lambdaArn = undefined,
	    mockLambdaSpy = undefined,
	    createFunctionParameters = undefined;

	var mockLambda = {
		createFunction: _sinon2["default"].spy(function (params, callback) {
			createFunctionParameters = params;
			callback(createFunctionError, createFunctionData);
		}),
		updateFunctionCode: _sinon2["default"].spy(function (params, callback) {
			callback(updateFunctionCodeError, updateFunctionCodeData);
		}),
		updateFunctionConfiguration: _sinon2["default"].spy(function (params, callback) {
			callback(updateFunctionConfigurationError, updateFunctionConfigurationData);
		})
	};

	var MockLambda = function MockLambda(config) {
		_classCallCheck(this, MockLambda);

		mockLambdaSpy(config);
		return mockLambda;
	};

	var MockAWS = {
		Lambda: MockLambda
	};

	beforeEach(function (done) {
		conan = new _conanJs2["default"]({
			region: "us-east-1"
		});

		lambdaArn = "arn:aws:lambda:us-east-1:123895237541:function:SomeLambda";
		roleArn = "arn:aws:lambda:us-east-1:123895237541:role:SomeRole";

		lambdaFilePath = __dirname + "/fixtures/lambda.js";
		lambdaZipFilePath = __dirname + "/fixtures/lambda.zip";

		parameters = new ((function () {
			function MockConanAwsLambda() {
				_classCallCheck(this, MockConanAwsLambda);
			}

			_createClass(MockConanAwsLambda, [{
				key: "name",
				value: function name() {
					return "TestFunction";
				}
			}, {
				key: "handler",
				value: function handler() {
					return "handler";
				}
			}, {
				key: "description",
				value: function description() {
					return "This is my Lambda!";
				}
			}, {
				key: "memorySize",
				value: function memorySize() {
					return 128;
				}
			}, {
				key: "publish",
				value: function publish() {
					return true;
				}
			}, {
				key: "timeout",
				value: function timeout() {
					return 3;
				}
			}, {
				key: "runtime",
				value: function runtime() {
					return "nodejs";
				}
			}, {
				key: "filePath",
				value: function filePath() {
					return lambdaFilePath;
				}
			}]);

			return MockConanAwsLambda;
		})())();

		context = {
			parameters: parameters,
			libraries: { AWS: MockAWS },
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

		mockLambdaSpy = _sinon2["default"].spy();

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
		mockLambdaSpy.calledWith({
			region: conan.config.region
		}).should.be["true"];
	});

	describe("(When Lambda is NOT New)", function () {
		it("should call AWS to update the lambda configuration with the designated parameters", function () {
			var fileName = _path2["default"].parse(parameters.filePath()).name;
			var handlerString = fileName + "." + parameters.handler();

			var updateConfigurationParameters = {
				FunctionName: parameters.name(),
				Handler: handlerString,
				Role: roleArn,
				Description: parameters.description(),
				MemorySize: parameters.memorySize(),
				Timeout: parameters.timeout()
			};
			mockLambda.updateFunctionConfiguration.firstCall.args[0].should.eql(updateConfigurationParameters);
		});

		it("should call AWS to update the lambda with the designated code", function () {
			var updateCodeParameters = {
				ZipFile: _fs2["default"].readFileSync(lambdaZipFilePath),
				FunctionName: parameters.name(),
				Publish: parameters.publish()
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
			context.results.lambdaArn = null;
			(0, _stepsUpsertLambdaStepJs2["default"])(conan, context, stepDone(done));
		});

		it("should call AWS with the designated lambda parameters", function () {
			var expectedCreateFunctionParameters = {
				FunctionName: parameters.name(),
				Handler: parameters.handler(),
				Role: roleArn,
				Description: parameters.description(),
				MemorySize: parameters.memorySize(),
				Timeout: parameters.timeout(),
				Runtime: "nodejs"
			};

			delete createFunctionParameters.Code;

			createFunctionParameters.should.deep.equal(expectedCreateFunctionParameters);
		});

		it("should call AWS with the designated lambda code", function () {
			var expectedCodeBuffer = _fs2["default"].readFileSync(__dirname + "/fixtures/lambda.zip");

			var codeBuffer = createFunctionParameters.Code.ZipFile;

			codeBuffer.should.deep.equal(expectedCodeBuffer);
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