import Conan from "../../../../conan.js";
import findLambdaByNameStep from "../../steps/findLambdaByNameStep.js";
import sinon from "sinon";

describe(".findLambdaByNameStep(conan, context, stepDone)", () => {
	let conan,
			context,
			stepDone,

			awsResponseError,
			awsResponseData,

			stepReturnError,
			stepReturnData,

			parameters,
			mockLambdaSpy;

	const mockLambda = {
		getFunction: sinon.spy((params, callback) => {
			callback(awsResponseError, awsResponseData);
		})
	};

	class MockLambda {
		constructor(config) {
			mockLambdaSpy(config);
			return mockLambda;
		}
	}

	const MockAWS = {
		Lambda: MockLambda
	};

	beforeEach(done => {
		conan = new Conan({
			region: "us-east-1"
		});

		parameters = new class MockConanAwsLambda {
			name() { return "TestFunction"; }
		}();

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

		mockLambdaSpy = sinon.spy();

		stepDone = (afterStepCallback) => {
			return (error, data) => {
				stepReturnError = error;
				stepReturnData = data;
				afterStepCallback();
			};
		};

		findLambdaByNameStep(conan, context, stepDone(done));
	});

	it("should be a function", () => {
		(typeof findLambdaByNameStep).should.equal("function");
	});

	it("should set the designated region on the lambda client", () => {
		mockLambdaSpy.calledWith({
			region: conan.config.region
		}).should.be.true;
	});

	it("should call AWS with the designated lambda name parameter", () => {
		mockLambda.getFunction.calledWith({
			FunctionName: context.parameters.name()
		}).should.be.true;
	});

	describe("(Lambda is Found)", () => {
		it("should return the found lambda id", () => {
			stepReturnData.should.eql({
				lambdaArn: awsResponseData.Configuration.FunctionArn
			});
		});

		it("should work indistinctly with a lambda parameters instead of a name parameter", done => {
			parameters = new class MockConanAwsLambda {
				lambda() { return "TestFunctionWithLambda"; }
			}();

			context = {
				parameters: parameters,
				libraries: { AWS: MockAWS },
				results: {}
			};

			findLambdaByNameStep(conan, context, (error, results) => {
				results.should.eql({
					lambdaArn: awsResponseData.Configuration.FunctionArn
				});
				done();
			});
		});
	});

	describe("(Lambda is not Found)", () => {
		beforeEach(done => {
			awsResponseError = { statusCode: 404 };
			findLambdaByNameStep(conan, context, stepDone(done));
		});

		it("should return the lambda arn as null", () => {
			const expectedData = { lambdaArn: null };
			stepReturnData.should.eql(expectedData);
		});
	});

	describe("(Unknown Error is Returned)", () => {
		let errorMessage;

		beforeEach(done => {
			errorMessage = "AWS returned status code 401";
			awsResponseError = { statusCode: 401, message: errorMessage };
			findLambdaByNameStep(conan, context, stepDone(done));
		});

		it("should return an error which stops the step runner", () => {
			stepReturnError.message.should.eql(errorMessage);
		});
	});
});
