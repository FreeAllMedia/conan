import sinon from "sinon";
import chai from "chai";
import upsertLambdaByNameStep from "../../steps/upsertLambdaByNameStep.js";

describe("upsertLambdaByNameStep", () => {
	let createFunctionSpy,
		updateFunctionConfigurationSpy,
		updateFunctionCodeSpy,
		constructorSpy,
		conan,
		context,
		should;

	class Lambda {
		constructor(parameters) {
			constructorSpy(parameters);
		}

		createFunction(params, callback) {
			createFunctionSpy(params, callback);
		}

		updateFunctionConfiguration(params, callback) {
			updateFunctionConfigurationSpy(params, callback);
		}

		updateFunctionCode(params, callback) {
			updateFunctionCodeSpy(params, callback);
		}
	}

	beforeEach(() => {
		constructorSpy = sinon.spy();

		should = chai.should();

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
					Lambda
				}
			}
		};
		conan = { config:
			{ "region": "us-east-1" }
		};
	});

	it("should be a function", () => {
		(typeof upsertLambdaByNameStep).should.equal("function");
	});

	describe("(when lambda is new)", () => {
		beforeEach(done => {
			createFunctionSpy = sinon.spy((parameters, callback) => {
				callback(null, {Configuration: {}});
			});
			context.results.lambda.found = false;
			upsertLambdaByNameStep(conan, context, () => {
				done();
			});
		});

		describe("(parameters)", () => {
			it("should send the function parameters", () => {
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

			it("should set the constructor parameters", () => {
				constructorSpy.firstCall.args[0].should.eql({
					region: "us-east-1"
				});
			});
		});

		describe("(response)", () => {
			let responseData;

			beforeEach(() => {
				responseData = {
					"CodeSize": 512
				};

				createFunctionSpy = sinon.spy((params, callback) => {
					callback(null, responseData);
				});
			});

			it("should return the response data in the results", done => {
				upsertLambdaByNameStep(conan, context, (error, result) => {
					result.lambda.response.should.eql(responseData);
					done();
				});
			});

			it("should not return an error", done => {
				upsertLambdaByNameStep(conan, context, (error) => {
					should.not.exist(error);
					done();
				});
			});
		});

		describe("(unknown error)", () => {
			beforeEach(done => {
				createFunctionSpy = sinon.spy((params, callback) => {
					callback({statusCode: 401}, {Configuration: {}});
				});
				upsertLambdaByNameStep(conan, context, () => {
					done();
				});
			});

			it("should return error", done => {
				upsertLambdaByNameStep(conan, context, (error) => {
					should.exist(error);
					done();
				});
			});

			it("should not return anything else", done => {
				upsertLambdaByNameStep(conan, context, (error, result) => {
					should.not.exist(result);
					done();
				});
			});
		});
	});

	describe("(when lambda exists)", () => {
		beforeEach(() => {
			context.results.lambda.found = true;
		});

		describe("(parameters)", () => {

			beforeEach(done => {
				constructorSpy = sinon.spy();
				updateFunctionConfigurationSpy = sinon.spy((parameters, callback) => {
					callback(null, {Configuration: {}});
				});
				updateFunctionCodeSpy = sinon.spy((parameters, callback) => {
					callback(null, {Code: {}});
				});
				upsertLambdaByNameStep(conan, context, () => {
					done();
				});
			});

			it("should send the parameters to updateFunctionConfiguration", () => {
				updateFunctionConfigurationSpy.firstCall.args[0].should.eql({
					FunctionName: context.parameters.name,
					Description: context.parameters.description,
					Handler: context.parameters.handler,
					MemorySize: context.parameters.memorySize,
					Role: context.parameters.role,
					Timeout: context.parameters.timeout
				});
			});

			it("should send the parameters to updateFunctionCode", () => {
				updateFunctionCodeSpy.firstCall.args[0].should.eql({
					FunctionName: context.parameters.name,
					Publish: context.parameters.publish,
					S3Bucket: context.parameters.s3Bucket,
					S3Key: context.parameters.s3Key,
					S3ObjectVersion: context.parameters.s3ObjectVersion
				});
			});

			it("should set the constructor parameters", () => {
				constructorSpy.firstCall.args[0].should.eql({
					region: "us-east-1"
				});
			});
		});

		describe("(response)", () => {
			let responseData;

			beforeEach(() => {
				responseData = {
					"CodeSize": 512
				};

				updateFunctionConfigurationSpy = sinon.spy((params, callback) => {
					callback(null, responseData);
				});

				updateFunctionCodeSpy = sinon.spy((params, callback) => {
					callback(null, responseData);
				});
			});

			it("should return the response data in the results", done => {
				upsertLambdaByNameStep(conan, context, (error, result) => {
					result.lambda.response.should.eql(responseData);
					done();
				});
			});

			it("should not return an error", done => {
				upsertLambdaByNameStep(conan, context, (error) => {
					should.not.exist(error);
					done();
				});
			});
		});

		describe("(error on update configuration)", () => {
			beforeEach(() => {
				updateFunctionConfigurationSpy = sinon.spy((params, callback) => {
					callback({statusCode: 401});
				});
			});

			it("should return error", done => {
				upsertLambdaByNameStep(conan, context, (error) => {
					should.exist(error);
					done();
				});
			});

			it("should not return anything else", done => {
				upsertLambdaByNameStep(conan, context, (error, result) => {
					should.not.exist(result);
					done();
				});
			});
		});

		describe("(error on update code)", () => {
			beforeEach(() => {
				updateFunctionConfigurationSpy = sinon.spy((params, callback) => {
					callback(null, {Configuration: {}});
				});
				updateFunctionCodeSpy = sinon.spy((params, callback) => {
					callback({statusCode: 401});
				});
			});

			it("should return error", done => {
				upsertLambdaByNameStep(conan, context, (error) => {
					should.exist(error);
					done();
				});
			});

			it("should not return anything else", done => {
				upsertLambdaByNameStep(conan, context, (error, result) => {
					should.not.exist(result);
					done();
				});
			});
		});
	});
});
