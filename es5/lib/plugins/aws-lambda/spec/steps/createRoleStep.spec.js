import Conan from "../../../../conan.js";
import createRoleStep from "../../steps/createRoleStep.js";
import sinon from "sinon";

describe(".createRoleStep(conan, context, stepDone)", () => {
	let conan,
			context,
			stepDone,

			awsResponseError,
			awsResponseData,

			stepReturnError,
			stepReturnData,

			parameters;

	const mockIam = {
		createRole: sinon.spy((params, callback) => {
			callback(awsResponseError, awsResponseData);
		})
	};

	const MockAWS = {
		IAM: sinon.spy(() => {
			return mockIam;
		})
	};

	beforeEach(() => {
		conan = new Conan({
			region: "us-east-1"
		});

		parameters = new class MockConanAwsLambda {
			role() { return "TestRole"; }
		}();

		context = {
			parameters: parameters,
			libraries: { AWS: MockAWS },
			results: {}
		};

		// "Role Found" response by default
		awsResponseData = {
			Role: {
				Arn: "arn:aws:lambda:us-east-1:123895237541:role:SomeRole"
			}
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

			createRoleStep(conan, context, stepDone(done));
		});

		it("should be a function", () => {
			(typeof createRoleStep).should.equal("function");
		});

		it("should set the designated region on the lambda client", () => {
			MockAWS.IAM.calledWith({
				region: conan.config.region
			}).should.be.true;
		});

		it("should call AWS with the designated role name parameter", () => {
			mockIam.createRole.calledWith({
				RoleName: context.parameters.role(),
				AssumeRolePolicyDocument: JSON.stringify({
						"Version": "2012-10-17",
						"Statement": {
							"Effect": "Allow",
							"Action": "sts:AssumeRole",
							"Principal": {
								"Service": "lambda.amazonaws.com"
							}
						}
					})
			}).should.be.true;
		});

		describe("(Role is Created)", () => {
			it("should return the role arn", () => {
				stepReturnData.should.eql({
					roleArn: awsResponseData.Role.Arn
				});
			});
		});

		describe("(Unknown Error is Returned)", () => {
			let errorMessage;

			beforeEach(done => {
				errorMessage = "AWS returned status code 401";
				awsResponseError = { statusCode: 401, message: errorMessage };
				createRoleStep(conan, context, stepDone(done));
			});

			it("should return an error which stops the step runner", () => {
				stepReturnError.message.should.eql(errorMessage);
			});
		});
	});

	describe("(When it was found before)", () => {
		beforeEach((done) => {
			mockIam.createRole = sinon.spy();
			stepDone = (afterStepCallback) => {
				return () => {
					afterStepCallback();
				};
			};
			context.results.roleArn = "something";
			createRoleStep(conan, context, stepDone(done));
		});

		it("should skip the AWS call entirely", () => {
			mockIam.createRole.called.should.be.false;
		});
	});
});
