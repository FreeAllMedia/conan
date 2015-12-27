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
			stepReturnData;

	const mockLambda = {
		getFunction: sinon.spy((params, callback) => {
			callback(awsResponseError, awsResponseData);
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

		context = {
			parameters: {
				name: "Conan"
			},
			dependencies: { AWS: MockAWS },
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
		MockAWS.Lambda.calledWith({
			region: conan.config.region
		}).should.be.true;
	});

	it("should call AWS with the designated lambda name parameter", () => {
		mockLambda.getFunction.calledWith({
			FunctionName: context.parameters.name
		}).should.be.true;
	});

	describe("(Lambda is Found)", () => {
		it("should return the found lambda id", () => {
			stepReturnData.should.eql({
				lambda: {
					id: awsResponseData.Configuration.FunctionArn
				}
			});
		});
	});

	describe("(Lambda is not Found)", () => {
		beforeEach(done => {
			awsResponseError = { statusCode: 404 };
			findLambdaByNameStep(conan, context, stepDone(done));
		});

		it("should return the lambda id as null", () => {
			const expectedData = { lambda: {	id: null } };
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
