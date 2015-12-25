import Conan from "../../../../conan.js";
import findRoleByNameStep from "../../steps/findRoleByNameStep.js";
import sinon from "sinon";

describe(".findRoleByNameStep(event, context, stepDone)", () => {
	let conan,
			conanConfig,
			stepParameters,
			awsError,
			awsData,
			stepReturnData,
			context;

	const iam = {
		getRole: sinon.spy((params, callback) => {
			callback(awsError, awsData);
		})
	};

	const AWS = {
		IAM: sinon.spy(() => {
			return iam;
		})
	};

	beforeEach(() => {
		conanConfig = {
			region: "us-east-1"
		};
		conan = new Conan(conanConfig);

		stepParameters = {
			name: "Conan"
		};

		context = {
			parameters: stepParameters,
			dependencies: { AWS: AWS },
			results: {}
		};

		awsData = null;
		awsError = null;
	});

	it("should be a function", () => {
		(typeof findRoleByNameStep).should.equal("function");
	});

	describe("(Role is Found)", () => {
		beforeEach(done => {
			awsData = {
				Role: {
					Arn: "arn:aws:lambda:us-east-1:123895237541:role:SomeRole"
				}
			};

			findRoleByNameStep(conan, context, (error, data) => {
				stepReturnData = data;
				done();
			});
		});

		it("should set the designated region on the lambda client", () => {
			AWS.IAM.calledWith({
				region: conanConfig.region
			}).should.be.true;
		});

		it("should call AWS with the designated role name parameter", () => {
			iam.getRole.calledWith({
				RoleName: stepParameters.name
			}).should.be.true;
		});

		it("should return the found role id", () => {
			stepReturnData.should.eql({
				role: {
					id: awsData.Role.Arn
				}
			});
		});
	});

	describe("(Role is not Found)", () => {
		beforeEach(done => {
			awsError = { statusCode: 404 };
			findRoleByNameStep(conan, context, (error, data) => {
				stepReturnData = data;
				done();
			});
		});

		it("should return the lambda id as null", () => {
			stepReturnData.should.eql({
				role: {
					id: null
				}
			});
		});
	});

	describe("(Unknown Error is Returned)", () => {
		it("should return an error which stops the step runner", done => {
			const errorMessage = "AWS returned status code 401";
			awsError = { statusCode: 401, message: errorMessage };
			findRoleByNameStep(conan, context, (error) => {
				error.message.should.eql(errorMessage);
				done();
			});
		});
	});
});
