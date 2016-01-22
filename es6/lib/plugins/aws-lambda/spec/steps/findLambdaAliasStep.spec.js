import Conan from "../../../../conan.js";
import findLambdaAliasStep from "../../steps/findLambdaAliasStep.js";
import sinon from "sinon";

describe(".findLambdaAliasStep(conan, context, stepDone)", () => {
	let conan,
			context,
			stepDone,

			awsResponseError,
			firstAliasArn,
			secondAliasArn,

			responseData,

			stepReturnError,
			stepReturnData,

			parameters;

	const mockLambda = {
		getAlias: sinon.spy((params, callback) => {
			callback(awsResponseError, responseData());
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
			lambda() { return "TestFunction"; }
			alias() { return [["development"], ["production", "1"]]; }
		}();

		context = {
			parameters: parameters,
			libraries: { AWS: MockAWS },
			results: {}
		};

		// "Role Found" response by default
		firstAliasArn = "arn:aws:lambda:aws-regions:accct-id:function:example:development";
		secondAliasArn = "arn:aws:lambda:aws-regions:accct-id:function:example:production";
		responseData = sinon.stub();

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

			findLambdaAliasStep(conan, context, stepDone(done));
		});

		it("should be a function", () => {
			(typeof findLambdaAliasStep).should.equal("function");
		});

		it("should set the designated region on the lambda client", () => {
			MockAWS.Lambda.calledWith({
				region: conan.config.region
			}).should.be.true;
		});

		it("should call AWS with the designated function name parameter", () => {
			mockLambda.getAlias.calledWith({
				"FunctionName": context.parameters.lambda(),
				"Name": "development"
			}).should.be.true;
		});

		describe("(Alias is Found and Updated for Every Alias)", () => {
			beforeEach(done => {
				responseData = sinon.stub();
				responseData.onCall(0).returns({
					AliasArn: firstAliasArn,
					FunctionVersion: "2"
				});

				responseData.onCall(1).returns({
					AliasArn: secondAliasArn,
					FunctionVersion: "3"
				});
				findLambdaAliasStep(conan, context, stepDone(done));
			});

			it("should return the alias arn", () => {
				stepReturnData.should.eql({
					aliases: { "development": firstAliasArn, "production": secondAliasArn }
				});
			});
		});

		describe("(Alias is Found but Updated just for Some Alias)", () => {
			beforeEach(() => {
				responseData.onCall(0).returns({
					AliasArn: firstAliasArn,
					FunctionVersion: "$LATEST"
				});

				responseData.onCall(1).returns({
					AliasArn: secondAliasArn,
					FunctionVersion: "2"
				});
			});

			it("should return the alias arn", () => {
				stepReturnData.should.eql({
					aliases: { "production": secondAliasArn }
				});
			});
		});

		describe("(Alias is not Found)", () => {
			beforeEach(() => {
				responseData = sinon.stub();
				responseData.onCall(0).returns({
					AliasArn: firstAliasArn,
					FunctionVersion: "$LATEST"
				});

				responseData.onCall(1).returns({
					AliasArn: secondAliasArn,
					FunctionVersion: "2"
				});
			});

			it("should return the alias arn", () => {
				stepReturnData.should.eql({ aliases: {} });
			});
		});

		describe("(Unknown Error is Returned)", () => {
			let errorMessage;

			beforeEach(done => {
				errorMessage = "AWS returned status code 401";
				awsResponseError = { statusCode: 401, message: errorMessage };
				findLambdaAliasStep(conan, context, stepDone(done));
			});

			it("should return an error which stops the step runner", () => {
				stepReturnError.message.should.eql(errorMessage);
			});
		});
	});
});
