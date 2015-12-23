"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _stepsUpsertLambdaByNameStepJs = require("../../steps/upsertLambdaByNameStep.js");

var _stepsUpsertLambdaByNameStepJs2 = _interopRequireDefault(_stepsUpsertLambdaByNameStepJs);

describe("upsertLambdaByNameStep", function () {
	var createFunctionSpy = undefined,
	    updateFunctionConfigurationSpy = undefined,
	    updateFunctionCodeSpy = undefined,
	    constructorSpy = undefined,
	    conan = undefined,
	    context = undefined,
	    should = undefined;

	var Lambda = (function () {
		function Lambda(parameters) {
			_classCallCheck(this, Lambda);

			constructorSpy(parameters);
		}

		_createClass(Lambda, [{
			key: "createFunction",
			value: function createFunction(params, callback) {
				createFunctionSpy(params, callback);
			}
		}, {
			key: "updateFunctionConfiguration",
			value: function updateFunctionConfiguration(params, callback) {
				updateFunctionConfigurationSpy(params, callback);
			}
		}, {
			key: "updateFunctionCode",
			value: function updateFunctionCode(params, callback) {
				updateFunctionCodeSpy(params, callback);
			}
		}]);

		return Lambda;
	})();

	beforeEach(function () {
		constructorSpy = _sinon2["default"].spy();

		should = _chai2["default"].should();

		context = {
			parameters: {
				name: "testLambda",
				handler: "accounts/create.handler",
				role: "roleName",
				runtime: "nodejs",
				description: "description test for a test lambda",
				memorySize: 512,
				publish: true,
				timeout: 60
			},
			results: {
				lambda: {
					name: "testLambda",
					found: false,
					s3Bucket: "testBucket",
					s3Key: "testBucketObjectKey",
					s3ObjectVersion: "testBucketObjectVersion"
				}
			},
			dependencies: {
				aws: {
					Lambda: Lambda
				}
			}
		};
		conan = { config: { "region": "us-east-1" }
		};
	});

	it("should be a function", function () {
		(typeof _stepsUpsertLambdaByNameStepJs2["default"]).should.equal("function");
	});

	describe("(when lambda is new)", function () {
		beforeEach(function (done) {
			createFunctionSpy = _sinon2["default"].spy(function (parameters, callback) {
				callback(null, { Configuration: {} });
			});
			context.results.lambda.found = false;
			(0, _stepsUpsertLambdaByNameStepJs2["default"])(conan, context, function () {
				done();
			});
		});

		describe("(parameters)", function () {
			it("should send the function parameters", function () {
				createFunctionSpy.firstCall.args[0].should.eql({
					Code: {
						S3Bucket: context.results.s3Bucket,
						S3Key: context.results.s3Key,
						S3ObjectVersion: context.results.s3ObjectVersion
					},
					FunctionName: context.parameters.name,
					Handler: context.parameters.handler,
					Role: context.parameters.role,
					Runtime: context.parameters.runtime,
					Description: context.parameters.description,
					MemorySize: context.parameters.memorySize,
					Publish: context.parameters.publish,
					Timeout: context.parameters.timeout
				});
			});

			it("should set the constructor parameters", function () {
				constructorSpy.firstCall.args[0].should.eql({
					region: "us-east-1"
				});
			});
		});

		describe("(response)", function () {
			var responseData = undefined;

			beforeEach(function () {
				responseData = {
					"CodeSize": 512
				};

				createFunctionSpy = _sinon2["default"].spy(function (params, callback) {
					callback(null, responseData);
				});
			});

			it("should return the response data in the results", function (done) {
				(0, _stepsUpsertLambdaByNameStepJs2["default"])(conan, context, function (error, result) {
					result.lambda.response.should.eql(responseData);
					done();
				});
			});

			it("should not return an error", function (done) {
				(0, _stepsUpsertLambdaByNameStepJs2["default"])(conan, context, function (error) {
					should.not.exist(error);
					done();
				});
			});
		});

		describe("(unknown error)", function () {
			beforeEach(function (done) {
				createFunctionSpy = _sinon2["default"].spy(function (params, callback) {
					callback({ statusCode: 401 }, { Configuration: {} });
				});
				(0, _stepsUpsertLambdaByNameStepJs2["default"])(conan, context, function () {
					done();
				});
			});

			it("should return error", function (done) {
				(0, _stepsUpsertLambdaByNameStepJs2["default"])(conan, context, function (error) {
					should.exist(error);
					done();
				});
			});

			it("should not return anything else", function (done) {
				(0, _stepsUpsertLambdaByNameStepJs2["default"])(conan, context, function (error, result) {
					should.not.exist(result);
					done();
				});
			});
		});
	});

	describe("(when lambda exists)", function () {
		beforeEach(function () {
			context.results.lambda.found = true;
		});

		describe("(parameters)", function () {

			beforeEach(function (done) {
				constructorSpy = _sinon2["default"].spy();
				updateFunctionConfigurationSpy = _sinon2["default"].spy(function (parameters, callback) {
					callback(null, { Configuration: {} });
				});
				updateFunctionCodeSpy = _sinon2["default"].spy(function (parameters, callback) {
					callback(null, { Code: {} });
				});
				(0, _stepsUpsertLambdaByNameStepJs2["default"])(conan, context, function () {
					done();
				});
			});

			it("should send the parameters to updateFunctionConfiguration", function () {
				updateFunctionConfigurationSpy.firstCall.args[0].should.eql({
					FunctionName: context.parameters.name,
					Description: context.parameters.description,
					Handler: context.parameters.handler,
					MemorySize: context.parameters.memorySize,
					Role: context.parameters.role,
					Timeout: context.parameters.timeout
				});
			});

			it("should send the parameters to updateFunctionCode", function () {
				updateFunctionCodeSpy.firstCall.args[0].should.eql({
					FunctionName: context.parameters.name,
					Publish: context.parameters.publish,
					S3Bucket: context.parameters.s3Bucket,
					S3Key: context.parameters.s3Key,
					S3ObjectVersion: context.parameters.s3ObjectVersion
				});
			});

			it("should set the constructor parameters", function () {
				constructorSpy.firstCall.args[0].should.eql({
					region: "us-east-1"
				});
			});
		});

		describe("(response)", function () {
			var responseData = undefined;

			beforeEach(function () {
				responseData = {
					"CodeSize": 512
				};

				updateFunctionConfigurationSpy = _sinon2["default"].spy(function (params, callback) {
					callback(null, responseData);
				});

				updateFunctionCodeSpy = _sinon2["default"].spy(function (params, callback) {
					callback(null, responseData);
				});
			});

			it("should return the response data in the results", function (done) {
				(0, _stepsUpsertLambdaByNameStepJs2["default"])(conan, context, function (error, result) {
					result.lambda.response.should.eql(responseData);
					done();
				});
			});

			it("should not return an error", function (done) {
				(0, _stepsUpsertLambdaByNameStepJs2["default"])(conan, context, function (error) {
					should.not.exist(error);
					done();
				});
			});
		});

		describe("(error on update configuration)", function () {
			beforeEach(function () {
				updateFunctionConfigurationSpy = _sinon2["default"].spy(function (params, callback) {
					callback({ statusCode: 401 });
				});
			});

			it("should return error", function (done) {
				(0, _stepsUpsertLambdaByNameStepJs2["default"])(conan, context, function (error) {
					should.exist(error);
					done();
				});
			});

			it("should not return anything else", function (done) {
				(0, _stepsUpsertLambdaByNameStepJs2["default"])(conan, context, function (error, result) {
					should.not.exist(result);
					done();
				});
			});
		});

		describe("(error on update code)", function () {
			beforeEach(function () {
				updateFunctionConfigurationSpy = _sinon2["default"].spy(function (params, callback) {
					callback(null, { Configuration: {} });
				});
				updateFunctionCodeSpy = _sinon2["default"].spy(function (params, callback) {
					callback({ statusCode: 401 });
				});
			});

			it("should return error", function (done) {
				(0, _stepsUpsertLambdaByNameStepJs2["default"])(conan, context, function (error) {
					should.exist(error);
					done();
				});
			});

			it("should not return anything else", function (done) {
				(0, _stepsUpsertLambdaByNameStepJs2["default"])(conan, context, function (error, result) {
					should.not.exist(result);
					done();
				});
			});
		});
	});
});