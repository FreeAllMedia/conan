"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _conanJs = require("../../../../conan.js");

var _conanJs2 = _interopRequireDefault(_conanJs);

var _stepsPublishLambdaVersionStepJs = require("../../steps/publishLambdaVersionStep.js");

var _stepsPublishLambdaVersionStepJs2 = _interopRequireDefault(_stepsPublishLambdaVersionStepJs);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

describe(".publishLambdaVersionStep(conan, context, stepDone)", function () {
	var conan = undefined,
	    context = undefined,
	    stepDone = undefined,
	    awsResponseError = undefined,
	    awsResponseData = undefined,
	    stepReturnError = undefined,
	    stepReturnData = undefined,
	    parameters = undefined;

	var mockLambda = {
		publishVersion: _sinon2["default"].spy(function (params, callback) {
			callback(awsResponseError, awsResponseData);
		})
	};

	var MockAWS = {
		Lambda: _sinon2["default"].spy(function () {
			return mockLambda;
		})
	};

	beforeEach(function () {
		conan = new _conanJs2["default"]({
			region: "us-east-1"
		});

		parameters = new ((function () {
			function MockConanAwsLambda() {
				_classCallCheck(this, MockConanAwsLambda);
			}

			_createClass(MockConanAwsLambda, [{
				key: "name",
				value: function name() {
					return "TestFunction";
				}
			}]);

			return MockConanAwsLambda;
		})())();

		context = {
			parameters: parameters,
			libraries: { AWS: MockAWS },
			results: {}
		};

		// "Role Found" response by default
		awsResponseData = {
			Version: "1"
		};
		awsResponseError = null;
	});

	describe("(When calling AWS)", function () {
		beforeEach(function (done) {
			stepDone = function (afterStepCallback) {
				return function (error, data) {
					stepReturnError = error;
					stepReturnData = data;
					afterStepCallback();
				};
			};

			(0, _stepsPublishLambdaVersionStepJs2["default"])(conan, context, stepDone(done));
		});

		it("should be a function", function () {
			(typeof _stepsPublishLambdaVersionStepJs2["default"]).should.equal("function");
		});

		it("should set the designated region on the lambda client", function () {
			MockAWS.Lambda.calledWith({
				region: conan.config.region
			}).should.be["true"];
		});

		it("should call AWS with the designated function name parameter", function () {
			mockLambda.publishVersion.calledWith({
				"FunctionName": context.parameters.name(),
				"Description": "conan autopublish step"
			}).should.be["true"];
		});

		describe("(Version is Published)", function () {
			it("should return the version number", function () {
				stepReturnData.should.eql({
					lambdaVersion: awsResponseData.Version
				});
			});
		});

		describe("(Unknown Error is Returned)", function () {
			var errorMessage = undefined;

			beforeEach(function (done) {
				errorMessage = "AWS returned status code 401";
				awsResponseError = { statusCode: 401, message: errorMessage };
				(0, _stepsPublishLambdaVersionStepJs2["default"])(conan, context, stepDone(done));
			});

			it("should return an error which stops the step runner", function () {
				stepReturnError.message.should.eql(errorMessage);
			});
		});
	});
});