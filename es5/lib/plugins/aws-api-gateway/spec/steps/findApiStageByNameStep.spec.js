import Conan from "../../../../conan.js";
import sinon from "sinon";
import chai from "chai";
import findApiStageByNameStep from "../../steps/findApiStageByNameStep.js";

describe("findApiStageByNameStep", () => {
	let getStageSpy,
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

		getStage(params, callback) {
			getStageSpy(params, callback);
		}
	}

	beforeEach(() => {
		conan = new Conan({
			region: "us-east-1"
		});

		constructorSpy = sinon.spy();
		getStageSpy = sinon.spy((params, callback) => {
			callback();
		});
		should = chai.should();

		parameters = new class MockConanAwsParameters {
			name() { 				return "testApi"; }
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
		(typeof findApiStageByNameStep).should.equal("function");
	});

	describe("(parameters)", () => {
		beforeEach(done => {
			findApiStageByNameStep(conan, context, () => {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS get function call", () => {
			getStageSpy.firstCall.args[0].should.eql({
				stageName: parameters.name(),
				restApiId
			});
		});

		it("should set the constructor parameters", () => {
			constructorSpy.firstCall.args[0].should.eql({
				region: conan.config.region
			});
		});
	});

	describe("(api stages not found)", () => {
		beforeEach(() => {
			getStageSpy = sinon.spy((params, callback) => {
				callback({ statusCode: 404 });
			});
		});

		it("should not return no error", done => {
			findApiStageByNameStep(conan, context, (error) => {
				should.not.exist(error);
				done();
			});
		});

		it("should not return results", done => {
			findApiStageByNameStep(conan, context, (error, result) => {
				should.not.exist(result);
				done();
			});
		});
	});

	describe("(api stage found)", () => {
		let responseData;

		beforeEach(() => {
			responseData = {stageName: "testApi"};
			getStageSpy = sinon.spy((params, callback) => {
				callback(null, responseData);
			});
		});

		it("should return the stage name for that stage", done => {
			findApiStageByNameStep(conan, context, (error, result) => {
				result.stageName.should.equal(responseData.stageName);
				done();
			});
		});
	});

	describe("(unknown error)", () => {
		beforeEach(() => {
			getStageSpy = sinon.spy((params, callback) => {
				callback({ statusCode: 401 });
			});
		});

		it("should return error", done => {
			findApiStageByNameStep(conan, context, (error) => {
				should.exist(error);
				done();
			});
		});
	});
});
