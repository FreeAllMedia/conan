import Conan from "../../../../conan.js";
import findRoleByNameStep from "../../steps/findRoleByNameStep.js";
import sinon from "sinon";

describe(".findRoleByNameStep(conan, context, stepDone)", () => {
	let conan,
			context,
			stepDone,

			awsResponseError,
			awsResponseData,

			stepReturnError,
			stepReturnData,

			parameters;

	const mockIam = {
		getRole: sinon.spy((params, callback) => {
			callback(awsResponseError, awsResponseData);
		})
	};

	const MockAWS = {
		IAM: sinon.spy(() => {
			return mockIam;
		})
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
			dependencies: { AWS: MockAWS },
			results: {}
		};

		// "Role Found" response by default
		awsResponseData = {
			Role: {
				Arn: "arn:aws:lambda:us-east-1:123895237541:role:SomeRole"
			}
		};
		awsResponseError = null;

		stepDone = (afterStepCallback) => {
			return (error, data) => {
				stepReturnError = error;
				stepReturnData = data;
				afterStepCallback();
			};
		};

		findRoleByNameStep(conan, context, stepDone(done));
	});

	it("should be a function", () => {
		(typeof findRoleByNameStep).should.equal("function");
	});

	it("should set the designated region on the lambda client", () => {
		MockAWS.IAM.calledWith({
			region: conan.config.region
		}).should.be.true;
	});

	it("should call AWS with the designated role name parameter", () => {
		mockIam.getRole.calledWith({
			RoleName: context.parameters.name()
		}).should.be.true;
	});

	describe("(Role is Found)", () => {
		it("should return the found role id", () => {
			stepReturnData.should.eql({
				roleArn: awsResponseData.Role.Arn
			});
		});
	});

	describe("(Role is not Found)", () => {
		beforeEach(done => {
			awsResponseError = { statusCode: 404 };
			findRoleByNameStep(conan, context, stepDone(done));
		});

		it("should return the lambda id as null", () => {
			const expectedData = { roleArn: null };
			stepReturnData.should.eql(expectedData);
		});
	});

	describe("(Unknown Error is Returned)", () => {
		let errorMessage;

		beforeEach(done => {
			errorMessage = "AWS returned status code 401";
			awsResponseError = { statusCode: 401, message: errorMessage };
			findRoleByNameStep(conan, context, stepDone(done));
		});

		it("should return an error which stops the step runner", () => {
			stepReturnError.message.should.eql(errorMessage);
		});
	});
});
