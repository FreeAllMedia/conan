"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _conan = require("../../../../conan.js");

var _conan2 = _interopRequireDefault(_conan);

var _findLambdaByNameStep = require("../../steps/findLambdaByNameStep.js");

var _findLambdaByNameStep2 = _interopRequireDefault(_findLambdaByNameStep);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

describe(".findLambdaByNameStep(conan, context, stepDone)", function () {
	var conan = undefined,
	    context = undefined,
	    stepDone = undefined,
	    awsResponseError = undefined,
	    awsResponseData = undefined,
	    stepReturnError = undefined,
	    stepReturnData = undefined,
	    parameters = undefined,
	    mockLambdaSpy = undefined;

	var mockLambda = {
		getFunction: _sinon2.default.spy(function (params, callback) {
			callback(awsResponseError, awsResponseData);
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
		conan = new _conan2.default({
			region: "us-east-1"
		});

		parameters = new (function () {
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
		}())();

		context = {
			parameters: parameters,
			libraries: { AWS: MockAWS },
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

		mockLambdaSpy = _sinon2.default.spy();

		stepDone = function stepDone(afterStepCallback) {
			return function (error, data) {
				stepReturnError = error;
				stepReturnData = data;
				afterStepCallback();
			};
		};

		(0, _findLambdaByNameStep2.default)(conan, context, stepDone(done));
	});

	it("should be a function", function () {
		(typeof _findLambdaByNameStep2.default === "undefined" ? "undefined" : _typeof(_findLambdaByNameStep2.default)).should.equal("function");
	});

	it("should set the designated region on the lambda client", function () {
		mockLambdaSpy.calledWith({
			region: conan.config.region
		}).should.be.true;
	});

	it("should call AWS with the designated lambda name parameter", function () {
		mockLambda.getFunction.calledWith({
			FunctionName: context.parameters.name()
		}).should.be.true;
	});

	describe("(No Lambda parameter)", function () {
		it("should skip the call entirely", function (done) {
			parameters = new (function () {
				function MockConanAwsLambda() {
					_classCallCheck(this, MockConanAwsLambda);
				}

				_createClass(MockConanAwsLambda, [{
					key: "lambda",
					value: function lambda() {
						return [];
					}
				}]);

				return MockConanAwsLambda;
			}())();

			context = {
				parameters: parameters,
				libraries: {
					AWS: {
						Lambda: function Lambda() {
							_classCallCheck(this, Lambda);
						}
					}
				},
				results: {}
			};

			(0, _findLambdaByNameStep2.default)(conan, context, function (error, results) {
				(results.lambdaArn === null).should.be.true;
				done();
			});
		});
	});

	describe("(Lambda is Found)", function () {
		it("should return the found lambda id", function () {
			stepReturnData.should.eql({
				lambdaArn: awsResponseData.Configuration.FunctionArn
			});
		});

		it("should work indistinctly with a lambda parameters instead of a name parameter", function (done) {
			parameters = new (function () {
				function MockConanAwsLambda() {
					_classCallCheck(this, MockConanAwsLambda);
				}

				_createClass(MockConanAwsLambda, [{
					key: "lambda",
					value: function lambda() {
						return ["TestFunctionWithLambda"];
					}
				}]);

				return MockConanAwsLambda;
			}())();

			context = {
				parameters: parameters,
				libraries: { AWS: MockAWS },
				results: {}
			};

			(0, _findLambdaByNameStep2.default)(conan, context, function (error, results) {
				results.should.eql({
					lambdaArn: awsResponseData.Configuration.FunctionArn
				});
				done();
			});
		});
	});

	describe("(Lambda is not Found)", function () {
		beforeEach(function (done) {
			awsResponseError = { statusCode: 404 };
			(0, _findLambdaByNameStep2.default)(conan, context, stepDone(done));
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
			(0, _findLambdaByNameStep2.default)(conan, context, stepDone(done));
		});

		it("should return an error which stops the step runner", function () {
			stepReturnError.message.should.eql(errorMessage);
		});
	});
});