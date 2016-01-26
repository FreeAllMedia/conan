import Conan from "../../../../conan.js";
import publishLambdaVersionStep from "../../steps/publishLambdaVersionStep.js";
import sinon from "sinon";

describe(".publishLambdaVersionStep(conan, context, stepDone)", () => {
	let conan,
			context,
			stepDone,

			awsResponseError,
			awsResponseData,

			stepReturnError,
			stepReturnData,

			parameters;

	const mockLambda = {
		publishVersion: sinon.spy((params, callback) => {
			callback(awsResponseError, awsResponseData);
		})
	};

	const MockAWS = {
		Lambda: sinon.spy(() => {
			return mockLambda;
		})
	};

	beforeEach(() => {
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

		// "Role Found" response by default
		awsResponseData = {
			Version: "1"
		};
		awsResponseError = null;

	});

	describe("(When calling AWS)", () => {
		beforeEach(done => {
			stepDone = (afterStepCallback) => {
				return (error, data) => {
					stepReturnError = error;
					stepReturnData = data;
					afterStepCallback();
				};
			};

			publishLambdaVersionStep(conan, context, stepDone(done));
		});

		it("should be a function", () => {
			(typeof publishLambdaVersionStep).should.equal("function");
		});

		it("should set the designated region on the lambda client", () => {
			MockAWS.Lambda.calledWith({
				region: conan.config.region
			}).should.be.true;
		});

		it("should call AWS with the designated function name parameter", () => {
			mockLambda.publishVersion.calledWith({
				"FunctionName": context.parameters.name(),
				"Description": "conan autopublish step"
			}).should.be.true;
		});

		describe("(Version is Published)", () => {
			it("should return the version number", () => {
				stepReturnData.should.eql({
					lambdaVersion: awsResponseData.Version
				});
			});
		});

		describe("(Unknown Error is Returned)", () => {
			let errorMessage;

			beforeEach(done => {
				errorMessage = "AWS returned status code 401";
				awsResponseError = { statusCode: 401, message: errorMessage };
				publishLambdaVersionStep(conan, context, stepDone(done));
			});

			it("should return an error which stops the step runner", () => {
				stepReturnError.message.should.eql(errorMessage);
			});
		});
	});
});
