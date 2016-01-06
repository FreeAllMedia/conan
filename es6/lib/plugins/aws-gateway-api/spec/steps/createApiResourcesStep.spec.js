import Conan from "../../../../conan.js";
import sinon from "sinon";
import chai from "chai";
import createApiResourcesStep from "../../steps/createApiResourcesStep.js";

describe("createApiResourcesStep", () => {
	let createResourceSpy,
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

		createResource(params, callback) {
			createResourceSpy(params, callback);
		}
	}

	beforeEach(() => {
		conan = new Conan({
			region: "us-east-1"
		});

		constructorSpy = sinon.spy();
		createResourceSpy = sinon.spy((params, callback) => {
			callback();
		});
		should = chai.should();

		parameters = new class MockConanAwsParameters {
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
		(typeof createApiResourcesStep).should.equal("function");
	});

	describe("(parameters)", () => {
		beforeEach(done => {
			createApiResourcesStep(conan, context, () => {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS create deployment call", () => {
			createResourceSpy.firstCall.args[0].should.eql({});
		});

		it("should set the constructor parameters", () => {
			constructorSpy.firstCall.args[0].should.eql({
				region: conan.config.region
			});
		});
	});

	describe("(unknown error)", () => {
		beforeEach(() => {
			createResourceSpy = sinon.spy((params, callback) => {
				callback({ statusCode: 401 });
			});
		});

		it("should return error", done => {
			createApiResourcesStep(conan, context, (error) => {
				should.exist(error);
				done();
			});
		});
	});
});
