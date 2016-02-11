import Conan from "../../../../conan.js";
import attachRolePolicyStep from "../../steps/attachRolePolicyStep.js";
import sinon from "sinon";
import chai from "chai";

describe(".attachRolePolicyStep(conan, context, stepDone)", () => {
	let conan,
			context,
			stepDone,

			awsResponseError,
			awsResponseData,

			stepReturnError,

			should,

			parameters;

	const mockIam = {
		attachRolePolicy: sinon.spy((params, callback) => {
			callback(awsResponseError, awsResponseData);
		})
	};

	const MockAWS = {
		IAM: sinon.spy(() => {
			return mockIam;
		})
	};

	beforeEach(done => {
		should = chai.should();
		conan = new Conan({
			region: "us-east-1"
		});

		parameters = new class MockConanAwsLambda {
			role() { return "TestRolePolicy"; }
		}();

		context = {
			parameters: parameters,
			libraries: { AWS: MockAWS },
			results: {}
		};

		awsResponseData = {};
		awsResponseError = null;

		stepDone = (afterStepCallback) => {
			return (error) => {
				stepReturnError = error;
				afterStepCallback();
			};
		};

		attachRolePolicyStep(conan, context, stepDone(done));
	});

	it("should be a function", () => {
		(typeof attachRolePolicyStep).should.equal("function");
	});

	it("should set the designated region on the lambda client", () => {
		MockAWS.IAM.calledWith({
			region: conan.config.region
		}).should.be.true;
	});

	it("should call AWS with the designated parameters", () => {
		mockIam.attachRolePolicy.calledWith({
			RoleName: context.parameters.role(),
			PolicyArn: "arn:aws:iam::aws:policy/AWSLambdaExecute"
		}).should.be.true;
	});

	describe("(Policy Attached)", () => {
		it("should return no error", () => {
			should.not.exist(stepReturnError);
		});
	});

	describe("(Unknown Error is Returned)", () => {
		let errorMessage;

		beforeEach(done => {
			errorMessage = "AWS returned status code 401";
			awsResponseError = { statusCode: 401, message: errorMessage };
			attachRolePolicyStep(conan, context, stepDone(done));
		});

		it("should return an error which stops the step runner", () => {
			stepReturnError.message.should.eql(errorMessage);
		});
	});
});
