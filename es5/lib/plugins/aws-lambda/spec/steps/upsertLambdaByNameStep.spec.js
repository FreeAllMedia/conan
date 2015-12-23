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

var conanUpsertLambdaByNameStep = (0, _rewire2["default"])("../../steps/upsertLambdaByNameStep.js");

describe("upsertLambdaByNameStep", function () {
	var conan = undefined,
	    context = undefined,
	    should = undefined;

	before(function () {
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
			}
		};
		conan = new _conanJs2["default"]({ "region": "us-east-1" });
	});

	it("should be a function", function () {
		(typeof conanUpsertLambdaByNameStep).should.equal("function");
	});

	describe("(when lambda is new)", function () {
		var createFunctionSpy = undefined;

		beforeEach(function () {
			createFunctionSpy = _sinon2["default"].spy();
		});

		describe("(parameters)", function () {
			var revertRewiredConstructor = undefined;
			var expectedFunctionParameters = undefined;
			var expectedConstructorParameters = undefined;
			var constructorSpy = undefined;

			beforeEach(function (done) {
				createFunctionSpy = _sinon2["default"].spy(function (params, callback) {
					callback({ statusCode: 404 });
				});

				expectedFunctionParameters = {
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
				};

				expectedConstructorParameters = {
					region: "us-east-1"
				};

				constructorSpy = _sinon2["default"].spy();

				revertRewiredConstructor = conanUpsertLambdaByNameStep.__set__("LambdaConstructor", function (constructorParameters) {
					constructorSpy(constructorParameters);
					return {
						createFunction: createFunctionSpy
					};
				});

				conanUpsertLambdaByNameStep(conan, context, function () {
					done();
				});
			});

			afterEach(function () {
				revertRewiredConstructor();
			});

			it("should send the function parameters", function () {
				createFunctionSpy.firstCall.args[0].should.eql(expectedFunctionParameters);
			});

			it("should set the constructor parameters", function () {
				constructorSpy.firstCall.args[0].should.eql(expectedConstructorParameters);
			});
		});

		describe("(unknown error)", function () {
			var revertRewiredConstructor = undefined;

			beforeEach(function () {
				createFunctionSpy = _sinon2["default"].spy(function (params, callback) {
					callback({ statusCode: 401 });
				});

				revertRewiredConstructor = conanUpsertLambdaByNameStep.__set__("LambdaConstructor", function () {
					return {
						createFunction: createFunctionSpy
					};
				});
			});

			afterEach(function () {
				revertRewiredConstructor();
			});

			it("should return error", function (done) {
				conanUpsertLambdaByNameStep(conan, context, function (error) {
					should.exist(error);
					done();
				});
			});
		});
	});

	describe("(when lambda exists)", function () {
		describe("(parameters)", function () {
			var revertRewiredConstructor = undefined;
			var expectedConstructorParameters = undefined;
			var constructorSpy = undefined;
			var awsUpdateCodeSpy = undefined;
			var awsUpdateConfigurationSpy = undefined;
			var expectedUpdateConfigurationFunctionParameters = undefined;
			var expectedUpdateCodeFunctionParameters = undefined;

			beforeEach(function (done) {
				expectedUpdateConfigurationFunctionParameters = {
					FunctionName: context.parameters.name,
					Description: context.parameters.description,
					Handler: context.parameters.handler,
					MemorySize: context.parameters.memorySize,
					Role: context.parameters.role,
					Timeout: context.parameters.timeout
				};

				expectedUpdateCodeFunctionParameters = {
					FunctionName: context.parameters.name,
					Publish: context.parameters.publish,
					S3Bucket: context.parameters.s3Bucket,
					S3Key: context.parameters.s3Key,
					S3ObjectVersion: context.parameters.s3ObjectVersion
				};

				expectedConstructorParameters = {
					region: "us-east-1"
				};

				constructorSpy = _sinon2["default"].spy();
				awsUpdateConfigurationSpy = _sinon2["default"].spy(function (parameters, callback) {
					callback(null, { Configuration: {} });
				});
				awsUpdateCodeSpy = _sinon2["default"].spy(function (parameters, callback) {
					callback(null, { Code: {} });
				});

				revertRewiredConstructor = conanUpsertLambdaByNameStep.__set__("LambdaConstructor", function (constructorParameters) {
					constructorSpy(constructorParameters);
					return {
						updateFunctionConfiguration: awsUpdateConfigurationSpy,
						updateFunctionCode: awsUpdateCodeSpy
					};
				});

				//now the lambda was found
				context.results.lambda.found = true;

				conanUpsertLambdaByNameStep(conan, context, function () {
					done();
				});
			});

			afterEach(function () {
				revertRewiredConstructor();
			});

			it("should send the parameters to updateCode", function () {
				awsUpdateConfigurationSpy.firstCall.args[0].should.eql(expectedUpdateConfigurationFunctionParameters);
			});

			it("should send the parameters to updateCode", function () {
				awsUpdateCodeSpy.firstCall.args[0].should.eql(expectedUpdateCodeFunctionParameters);
			});

			it("should set the constructor parameters", function () {
				constructorSpy.firstCall.args[0].should.eql(expectedConstructorParameters);
			});
		});
	});
});