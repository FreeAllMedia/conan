import Conan from "../../../../conan.js";
import upsertLambdaStep from "../../steps/upsertLambdaStep.js";
import sinon from "sinon";
import fileSystem from "fs";
import path from "path";
import temp from "temp";
import unzip from "unzip2";

temp.track();

describe(".upsertLambdaStep(conan, context, stepDone)", () => {
	let conan,
			context,
			stepDone,

			createFunctionError,
			createFunctionData,

			updateFunctionCodeError,
			updateFunctionCodeData,

			updateFunctionConfigurationError,
			updateFunctionConfigurationData,

			stepReturnError,
			stepReturnData,

			parameters,
			lambdaZipFilePath,
			lambdaFilePath;

	const mockLambda = {
		createFunction: sinon.spy((params, callback) => {
			callback(createFunctionError, createFunctionData);
		}),
		updateFunctionCode: sinon.spy((params, callback) => {
			callback(updateFunctionCodeError, updateFunctionCodeData);
		}),
		updateFunctionConfiguration: sinon.spy((params, callback) => {
			callback(updateFunctionConfigurationError, updateFunctionConfigurationData);
		})
	};

	const MockAWS = {
		Lambda: sinon.spy(() => {
			return mockLambda;
		})
	};

	beforeEach(done => {
		conan = new Conan({
			region: "us-east-1"
		});

		const lambdaArn = "arn:aws:lambda:us-east-1:123895237541:function:SomeLambda";
		const roleArn = "arn:aws:lambda:us-east-1:123895237541:role:SomeRole";

		lambdaFilePath = __dirname + "/fixtures/lambda.js";
		lambdaZipFilePath = __dirname + "/fixtures/lambda.zip";

		parameters = new class MockConanAwsLambda {
			name() { 				return "TestFunction"; }
			handler() { 		return "handler"; }
			role() { 				return roleArn; }
			description() { return "This is my Lambda!"; }
			memorySize() { 	return 128; }
			publish() { 		return true; }
			timeout() { 		return 3; }
		}();

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

		stepDone = (afterStepCallback) => {
			return (error, data) => {
				stepReturnError = error;
				stepReturnData = data;
				afterStepCallback();
			};
		};

		upsertLambdaStep(conan, context, stepDone(done));
	});

	afterEach(done => {
		temp.cleanup(done);
	});

	it("should be a function", () => {
		(typeof upsertLambdaStep).should.equal("function");
	});

	it("should set the designated region on the lambda client", () => {
		MockAWS.Lambda.calledWith({
			region: conan.config.region
		}).should.be.true;
	});

	describe("(When Lambda is NOT New)", () => {
		it("should call AWS to update the lambda configuration with the designated parameters", () => {
			const updateConfigurationParameters = {
				FunctionName: parameters.name(),
				Handler: parameters.handler(),
				Role: parameters.role(),
				Description: parameters.description(),
				MemorySize: parameters.memorySize(),
				Timeout: parameters.timeout()
			};
			mockLambda.updateFunctionConfiguration.firstCall.args[0].should.eql(updateConfigurationParameters);
		});

		it("should call AWS to update the lambda with the designated code", () => {
			const updateCodeParameters = {
				ZipFile: fileSystem.readFileSync(lambdaZipFilePath),
				FunctionName: parameters.name(),
				Publish: parameters.publish()
			};
			mockLambda.updateFunctionCode.firstCall.args[0].should.eql(updateCodeParameters);
		});

		describe("(Lambda is Updated)", () => {
			beforeEach(done => {
				updateFunctionConfigurationData = {
					FunctionArn: createFunctionData.FunctionArn
				};
				upsertLambdaStep(conan, context, stepDone(done));
			});

			it("should return the lambda Amazon Resource Name", () => {
				stepReturnData.should.eql({
					lambdaArn: updateFunctionConfigurationData.FunctionArn
				});
			});
		});

		describe("(Lambda Code is NOT Updated)", () => {
			beforeEach(() => {
				updateFunctionCodeError = new Error();
				updateFunctionCodeError.statusCode = 400;
			});

			it("should throw an error", () => {
				() => {
					upsertLambdaStep(conan, context);
				}.should.throw();
			});
		});

		describe("(Lambda Configuration is NOT Updated)", () => {
			beforeEach(() => {
				updateFunctionConfigurationError = new Error();
				updateFunctionConfigurationError.statusCode = 400;
			});

			it("should throw an error", () => {
				() => {
					upsertLambdaStep(conan, context);
				}.should.throw();
			});
		});
	});

	describe("(When Lambda is New)", () => {
		beforeEach(done => {
			delete context.results.lambdaArn;
			upsertLambdaStep(conan, context, stepDone(done));
		});

		it("should call AWS with the designated lambda parameters", () => {
			mockLambda.createFunction.firstCall.args[0].should.eql(parameters);
		});

		describe("(Lambda is Created)", () => {
			it("should return the lambda Amazon Resource Name", () => {
				stepReturnData.should.eql({
					lambdaArn: createFunctionData.FunctionArn
				});
			});
		});

		describe("(Lambda is NOT Created)", () => {
			beforeEach(() => {
				createFunctionError = new Error();
				createFunctionError.statusCode = 400;
			});

			it("should throw an error", () => {
				() => {
					upsertLambdaStep(conan, context);
				}.should.throw();
			});
		});

	});
});
