import Conan from "../../../../conan.js";
import sinon from "sinon";
import chai from "chai";
import putIntegrationResponseStep from "../../steps/putIntegrationResponseStep.js";

describe("putIntegrationResponseStep", () => {
	let putIntegrationResponseSpy,
		constructorSpy,
		conan,
		context,
		parameters,
		restApiId,
		apiResourceId,
		responseTemplates,
		should;

	class APIGateway {
		constructor(constructorParameters) {
			constructorSpy(constructorParameters);
		}

		putIntegrationResponse(params, callback) {
			putIntegrationResponseSpy(params, callback);
		}
	}

	beforeEach(() => {
		conan = new Conan({
			region: "us-east-1"
		});

		constructorSpy = sinon.spy();
		putIntegrationResponseSpy = sinon.spy((params, callback) => {
			callback();
		});
		should = chai.should();

		parameters = new class MockConanAwsParameters {
			method() { return "GET"; }
			statusCodes() { return [200]; }
		}();

		restApiId = "23sysh";
		apiResourceId = "23sysh3";
		responseTemplates = {"application/json": ""};

		context = {
			parameters,
			results: {
				restApiId,
				apiResourceId
			},
			libraries: {
				AWS: {
					APIGateway
				}
			}
		};
	});

	it("should be a function", () => {
		(typeof putIntegrationResponseStep).should.equal("function");
	});

	describe("(parameters)", () => {
		beforeEach(done => {
			putIntegrationResponseStep(conan, context, () => {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS call", () => {
			putIntegrationResponseSpy.firstCall.args[0].should.eql({
				resourceId: apiResourceId,
				httpMethod: parameters.method(),
				restApiId,
				responseTemplates,
				selectionPattern: "",
				statusCode: "200"
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
			putIntegrationResponseSpy = sinon.spy();
		});

		it("should skip the function call entirely", done => {
			putIntegrationResponseStep(conan, context, () => {
				putIntegrationResponseSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(integration response created)", () => {
		let responseData;

		beforeEach(() => {
			responseData = {};
			putIntegrationResponseSpy = sinon.spy((awsParameters, callback) => {
				callback(null, responseData);
			});
		});

		it("should not return error", done => {
			putIntegrationResponseStep(conan, context, (error) => {
				should.not.exist(error);
				done();
			});
		});

		describe("(many statuses)", () => {
			beforeEach(() => {
				parameters = new class MockConanAwsParameters {
					method() { return "GET"; }
					statusCodes() { return [200, 401, 404]; }
				}();

				restApiId = "23sysh";
				apiResourceId = "23sysh3";
				responseTemplates = {"application/json": ""};

				context = {
					parameters,
					results: {
						restApiId,
						apiResourceId
					},
					libraries: {
						AWS: {
							APIGateway
						}
					}
				};
			});

			it("should put them all", done => {
				putIntegrationResponseStep(conan, context, () => {
					sinon.assert.callCount(putIntegrationResponseSpy, 3);
					done();
				});
			});
		});
	});

	describe("(api resource id is not present)", () => {
		beforeEach(() => {
			delete context.results.apiResourceId;
			putIntegrationResponseSpy = sinon.spy();
		});

		it("should skip the function call entirely", done => {
			putIntegrationResponseStep(conan, context, () => {
				putIntegrationResponseSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(unknown error)", () => {
		beforeEach(() => {
			putIntegrationResponseSpy = sinon.spy((params, callback) => {
				callback({ statusCode: 401 });
			});
		});

		it("should return an error when is just one", done => {
			putIntegrationResponseStep(conan, context, (error) => {
				should.exist(error);
				done();
			});
		});
	});
});
