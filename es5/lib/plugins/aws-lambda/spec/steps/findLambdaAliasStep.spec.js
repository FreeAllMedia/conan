"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _conanJs = require("../../../../conan.js");

var _conanJs2 = _interopRequireDefault(_conanJs);

var _stepsFindLambdaAliasStepJs = require("../../steps/findLambdaAliasStep.js");

var _stepsFindLambdaAliasStepJs2 = _interopRequireDefault(_stepsFindLambdaAliasStepJs);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

describe(".findLambdaAliasStep(conan, context, stepDone)", function () {
	var conan = undefined,
	    should = undefined,
	    context = undefined,
	    stepDone = undefined,
	    awsResponseError = undefined,
	    firstAliasArn = undefined,
	    secondAliasArn = undefined,
	    responseData = undefined,
	    stepReturnError = undefined,
	    stepReturnData = undefined,
	    parameters = undefined;

	var mockLambda = {
		getAlias: _sinon2["default"].spy(function (params, callback) {
			callback(awsResponseError, responseData(params));
		})
	};

	var MockAWS = {
		Lambda: _sinon2["default"].spy(function () {
			return mockLambda;
		})
	};

	beforeEach(function () {
		should = _chai2["default"].should();
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
			}, {
				key: "alias",
				value: function alias() {
					return [["development"], ["production", "1"]];
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
		firstAliasArn = "arn:aws:lambda:aws-regions:accct-id:function:example:development";
		secondAliasArn = "arn:aws:lambda:aws-regions:accct-id:function:example:production";

		awsResponseError = null;

		responseData = _sinon2["default"].stub();
		responseData.withArgs({ FunctionName: "TestFunction", Name: "development" }).returns({});

		responseData.withArgs({ FunctionName: "TestFunction", Name: "production" }).returns({});

		responseData.withArgs({ FunctionName: "TestFunction", Name: "development-some" }).returns({
			AliasArn: firstAliasArn,
			FunctionVersion: "$LATEST"
		});

		responseData.withArgs({ FunctionName: "TestFunction", Name: "production-some" }).returns({
			AliasArn: secondAliasArn,
			FunctionVersion: "2"
		});

		responseData.withArgs({ FunctionName: "TestFunction", Name: "development-all" }).returns({
			AliasArn: firstAliasArn,
			FunctionVersion: "$LATEST"
		});

		responseData.withArgs({ FunctionName: "TestFunction", Name: "production-all" }).returns({
			AliasArn: secondAliasArn,
			FunctionVersion: "1"
		});
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

			(0, _stepsFindLambdaAliasStepJs2["default"])(conan, context, stepDone(done));
		});

		it("should be a function", function () {
			(typeof _stepsFindLambdaAliasStepJs2["default"]).should.equal("function");
		});

		it("should set the designated region on the lambda client", function () {
			MockAWS.Lambda.calledWith({
				region: conan.config.region
			}).should.be["true"];
		});

		it("should call AWS with the designated function name parameter", function () {
			mockLambda.getAlias.calledWith({
				"FunctionName": context.parameters.name(),
				"Name": "development"
			}).should.be["true"];
		});

		describe("(Alias is Found and Updated for Every Alias)", function () {
			beforeEach(function (done) {
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
						key: "alias",
						value: function alias() {
							return [["development-all"], ["production-all", "1"]];
						}
					}]);

					return MockConanAwsLambda;
				})())();

				context = {
					parameters: parameters,
					libraries: { AWS: MockAWS },
					results: {}
				};
				(0, _stepsFindLambdaAliasStepJs2["default"])(conan, context, stepDone(done));
			});

			it("should return the alias arn", function () {
				stepReturnData.should.eql({
					aliases: {
						"development-all": {
							aliasArn: firstAliasArn,
							functionVersion: "$LATEST"
						},
						"production-all": {
							aliasArn: secondAliasArn,
							functionVersion: "1"
						}
					}
				});
			});
		});

		describe("(Alias is Found but Updated just for Some Alias)", function () {
			beforeEach(function (done) {
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
						key: "alias",
						value: function alias() {
							return [["development-some"], ["production-some", "1"]];
						}
					}]);

					return MockConanAwsLambda;
				})())();

				context = {
					parameters: parameters,
					libraries: { AWS: MockAWS },
					results: {}
				};
				(0, _stepsFindLambdaAliasStepJs2["default"])(conan, context, stepDone(done));
			});

			it("should return the alias arn", function () {
				stepReturnData.should.eql({
					aliases: {
						"development-some": {
							aliasArn: firstAliasArn,
							functionVersion: "$LATEST"
						},
						"production-some": {
							aliasArn: secondAliasArn
						}
					}
				});
			});
		});

		describe("(Alias is not Found)", function () {
			beforeEach(function (done) {
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
						key: "alias",
						value: function alias() {
							return [["development"], ["production", "1"]];
						}
					}]);

					return MockConanAwsLambda;
				})())();

				context = {
					parameters: parameters,
					libraries: { AWS: MockAWS },
					results: {}
				};
				(0, _stepsFindLambdaAliasStepJs2["default"])(conan, context, stepDone(done));
			});

			it("should return the alias arn", function () {
				stepReturnData.should.eql({ aliases: {} });
			});
		});

		describe("(Not Found is Returned)", function () {
			var errorMessage = undefined;

			beforeEach(function () {
				errorMessage = "AWS returned status code 404";
				awsResponseError = { statusCode: 404, message: errorMessage };
			});

			it("should skip the alias because it does not exist", function (done) {
				(0, _stepsFindLambdaAliasStepJs2["default"])(conan, context, function (error) {
					should.not.exist(error);
					done();
				});
			});
		});

		describe("(Unknown Error is Returned)", function () {
			var errorMessage = undefined;

			beforeEach(function (done) {
				errorMessage = "AWS returned status code 401";
				awsResponseError = { statusCode: 401, message: errorMessage };
				(0, _stepsFindLambdaAliasStepJs2["default"])(conan, context, stepDone(done));
			});

			it("should return an error which stops the step runner", function () {
				stepReturnError.message.should.eql(errorMessage);
			});
		});
	});
});