import Conan from "../../../../conan.js";
import sinon from "sinon";
import chai from "chai";
import createApiStageStep from "../../steps/createApiStageStep.js";

describe("createApiStageStep", () => {
	let createDeploymentSpy,
		constructorSpy,
		conan,
		context,
		parameters,
		restApiId,
		should;

	class APIGateway {
		constructor(constructorParameters) {
			constructorSpy(constructorParameters);
		}

		createDeployment(params, callback) {
			createDeploymentSpy(params, callback);
		}
	}

	beforeEach(() => {
		conan = new Conan({
			region: "us-east-1"
		});

		constructorSpy = sinon.spy();
		createDeploymentSpy = sinon.spy((params, callback) => {
			callback();
		});
		should = chai.should();

		parameters = new class MockConanAwsParameters {
			name() { 				return "testStage"; }
			description() { 				return "testStage description"; }
		}();

		restApiId = "23sysh";

		context = {
			parameters,
			results: {
				restApiId
			},
			libraries: {
				AWS: {
					APIGateway
				}
			}
		};
	});

	it("should be a function", () => {
		(typeof createApiStageStep).should.equal("function");
	});

	describe("(parameters)", () => {
		beforeEach(done => {
			createApiStageStep(conan, context, () => {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS call", () => {
			createDeploymentSpy.firstCall.args[0].should.eql({
				restApiId,
				stageName: "testStage",
				description: "conan deployment for stage creation",
				stageDescription: "testStage description"
			});
		});

		it("should set the constructor parameters", () => {
			constructorSpy.firstCall.args[0].should.eql({
				region: conan.config.region
			});
		});
	});

	describe("(rest api id is not present)", () => {
		beforeEach(() => {
			delete context.results.restApiId;
			createDeploymentSpy = sinon.spy();
		});

		it("should skip the function call entirely", done => {
			createApiStageStep(conan, context, () => {
				createDeploymentSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(rest api id is present but stage already exists)", () => {
		beforeEach(() => {
			context.results = { restApiId, stageName: "testStage" };
			createDeploymentSpy = sinon.spy();
		});

		it("should skip the function call entirely", done => {
			createApiStageStep(conan, context, () => {
				createDeploymentSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(stage created)", () => {
		let responseData;

		beforeEach(() => {
			responseData = {name: "testStage", id: 2};
			createDeploymentSpy = sinon.spy((params, callback) => {
				callback(null, responseData);
			});
		});

		it("should return with no error for that stage", done => {
			createApiStageStep(conan, context, (error) => {
				should.not.exist(error);
				done();
			});
		});

		it("should return the deployment id", done => {
			createApiStageStep(conan, context, (error, result) => {
				result.deploymentId.should.equal(responseData.id);
				done();
			});
		});

		it("should return the stage name", done => {
			createApiStageStep(conan, context, (error, result) => {
				result.stageName.should.equal(parameters.name());
				done();
			});
		});
	});

	describe("(unknown error)", () => {
		beforeEach(() => {
			createDeploymentSpy = sinon.spy((params, callback) => {
				callback({ statusCode: 401 });
			});
		});

		it("should return error", done => {
			createApiStageStep(conan, context, (error) => {
				should.exist(error);
				done();
			});
		});
	});
});
