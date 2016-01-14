import Conan from "../../../../conan.js";
import sinon from "sinon";
import chai from "chai";
import updateApiStageStep from "../../steps/updateApiStageStep.js";

describe("updateApiStageStep", () => {
	let updateStageSpy,
		constructorSpy,
		conan,
		context,
		parameters,
		restApiId,
		stageName,
		should;

	class APIGateway {
		constructor(constructorParameters) {
			constructorSpy(constructorParameters);
		}

		updateStage(params, callback) {
			updateStageSpy(params, callback);
		}
	}

	beforeEach(() => {
		conan = new Conan({
			region: "us-east-1"
		});

		constructorSpy = sinon.spy();
		updateStageSpy = sinon.spy((params, callback) => {
			callback();
		});
		should = chai.should();

		parameters = new class MockConanAwsParameters {
			name() { return "testStage"; }
			description() { return "testStage description"; }
		}();

		restApiId = "23sysh";
		stageName = "testStage";

		context = {
			parameters,
			results: {
				restApiId,
				stageName
			},
			libraries: {
				AWS: {
					APIGateway
				}
			}
		};
	});

	it("should be a function", () => {
		(typeof updateApiStageStep).should.equal("function");
	});

	describe("(parameters)", () => {
		beforeEach(done => {
			updateApiStageStep(conan, context, () => {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS get function call", () => {
			updateStageSpy.firstCall.args[0].should.eql({
				restApiId,
				stageName: "testStage",
				patchOperations: [
					{
						op: "replace",
						path: "/description",
						value: "testStage description"
					}
				]
			});
		});

		it("should set the constructor parameters", () => {
			constructorSpy.firstCall.args[0].should.eql({
				region: conan.config.region
			});
		});
	});

	describe("(rest api id not present)", () => {
		beforeEach(() => {
			delete context.results.restApiId;
			updateStageSpy = sinon.spy();
		});

		it("should skip the function call entirely", done => {
			updateApiStageStep(conan, context, () => {
				updateStageSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(stage name not present)", () => {
		beforeEach(() => {
			delete context.results.stageName;
			updateStageSpy = sinon.spy();
		});

		it("should skip the function call entirely", done => {
			updateApiStageStep(conan, context, () => {
				updateStageSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(api stage updated)", () => {
		let responseData;

		beforeEach(() => {
			responseData = {stageName: "testStage", deploymentId: 3};
			updateStageSpy = sinon.spy((params, callback) => {
				callback(null, responseData);
			});
		});

		it("should return with no error for that api", done => {
			updateApiStageStep(conan, context, (error) => {
				should.not.exist(error);
				done();
			});
		});

		it("should return the new stage name for that stage", done => {
			updateApiStageStep(conan, context, (error, results) => {
				results.stageName.should.equal(responseData.stageName);
				done();
			});
		});

		it("should return the deployment id for that stage", done => {
			updateApiStageStep(conan, context, (error, results) => {
				results.deploymentId.should.equal(responseData.deploymentId);
				done();
			});
		});
	});

	describe("(unknown error)", () => {
		beforeEach(() => {
			updateStageSpy = sinon.spy((params, callback) => {
				callback({ statusCode: 401 });
			});
		});

		it("should return error", done => {
			updateApiStageStep(conan, context, (error) => {
				should.exist(error);
				done();
			});
		});
	});
});
