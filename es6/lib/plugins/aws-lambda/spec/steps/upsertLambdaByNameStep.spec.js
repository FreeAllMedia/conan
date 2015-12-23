import rewire from "rewire";
import sinon from "sinon";
import chai from "chai";
import Conan from "../../../../conan.js";
const conanUpsertLambdaByNameStep = rewire("../../steps/upsertLambdaByNameStep.js");

describe("upsertLambdaByNameStep", () => {
	let conan,
		context,
		should;

	before(() => {
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
			}
		};
		conan = new Conan({"region": "us-east-1"});
	});

	it("should be a function", () => {
		(typeof conanUpsertLambdaByNameStep).should.equal("function");
	});

	describe("(when lambda is new)", () => {
		let createFunctionSpy;

		beforeEach(() => {
			createFunctionSpy = sinon.spy();
		});

		describe("(parameters)", () => {
			let revertRewiredConstructor;
			let expectedFunctionParameters;
			let expectedConstructorParameters;
			let constructorSpy;

			beforeEach(done => {
				createFunctionSpy = sinon.spy((params, callback) => {
					callback({statusCode: 404});
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

				constructorSpy = sinon.spy();

				revertRewiredConstructor = conanUpsertLambdaByNameStep.__set__("LambdaConstructor",
					(constructorParameters) => {
						constructorSpy(constructorParameters);
						return {
							createFunction: createFunctionSpy
						};
					}
				);

				conanUpsertLambdaByNameStep(conan, context, () => {
					done();
				});
			});

			afterEach(() => {
				revertRewiredConstructor();
			});

			it("should send the function parameters", () => {
				createFunctionSpy.firstCall.args[0].should.eql(expectedFunctionParameters);
			});

			it("should set the constructor parameters", () => {
				constructorSpy.firstCall.args[0].should.eql(expectedConstructorParameters);
			});
		});

		describe("(unknown error)", () => {
			let revertRewiredConstructor;

			beforeEach(() => {
				createFunctionSpy = sinon.spy((params, callback) => {
					callback({statusCode: 401});
				});

				revertRewiredConstructor = conanUpsertLambdaByNameStep.__set__("LambdaConstructor",
					() => {
						return {
							createFunction: createFunctionSpy
						};
					}
				);
			});

			afterEach(() => {
				revertRewiredConstructor();
			});

			it("should return error", done => {
				conanUpsertLambdaByNameStep(conan, context, (error) => {
					should.exist(error);
					done();
				});
			});
		});
	});

	describe("(when lambda exists)", () => {
		describe("(parameters)", () => {
			let revertRewiredConstructor;
			let expectedConstructorParameters;
			let constructorSpy;
			let awsUpdateCodeSpy;
			let awsUpdateConfigurationSpy;
			let expectedUpdateConfigurationFunctionParameters;
			let expectedUpdateCodeFunctionParameters;

			beforeEach(done => {
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

				constructorSpy = sinon.spy();
				awsUpdateConfigurationSpy = sinon.spy((parameters, callback) => {
					callback(null, {Configuration: {}});
				});
				awsUpdateCodeSpy = sinon.spy((parameters, callback) => {
					callback(null, {Code: {}});
				});

				revertRewiredConstructor = conanUpsertLambdaByNameStep.__set__("LambdaConstructor",
					(constructorParameters) => {
						constructorSpy(constructorParameters);
						return {
							updateFunctionConfiguration: awsUpdateConfigurationSpy,
							updateFunctionCode: awsUpdateCodeSpy
						};
					}
				);

				//now the lambda was found
				context.results.lambda.found = true;

				conanUpsertLambdaByNameStep(conan, context, () => {
					done();
				});
			});

			afterEach(() => {
				revertRewiredConstructor();
			});

			it("should send the parameters to updateCode", () => {
				awsUpdateConfigurationSpy.firstCall.args[0].should.eql(expectedUpdateConfigurationFunctionParameters);
			});

			it("should send the parameters to updateCode", () => {
				awsUpdateCodeSpy.firstCall.args[0].should.eql(expectedUpdateCodeFunctionParameters);
			});

			it("should set the constructor parameters", () => {
				constructorSpy.firstCall.args[0].should.eql(expectedConstructorParameters);
			});
		});
	});
});
