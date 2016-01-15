import Conan from "../../../../conan.js";
import sinon from "sinon";
import chai from "chai";
import putMethodResponseStep from "../../steps/putMethodResponseStep.js";

describe("putMethodResponseStep", () => {
	let putMethodResponseSpy,
		constructorSpy,
		conan,
		context,
		parameters,
		restApiId,
		apiResourceId,
		should;

	class APIGateway {
		constructor(constructorParameters) {
			constructorSpy(constructorParameters);
		}

		putMethodResponse(params, callback) {
			putMethodResponseSpy(params, callback);
		}
	}

	beforeEach(() => {
		conan = new Conan({
			region: "us-east-1"
		});

		constructorSpy = sinon.spy();
		putMethodResponseSpy = sinon.spy((params, callback) => {
			callback();
		});
		should = chai.should();

		parameters = new class MockConanAwsParameters {
			method() { return "GET"; }
			statusCodes() { return [200]; }
		}();

		restApiId = "23sysh";
		apiResourceId = "23sysh3";

		context = {
			parameters,
			results: {
				restApiId,
				apiResourceId,
				responseStatusCodes: []
			},
			libraries: {
				AWS: {
					APIGateway
				}
			}
		};
	});

	it("should be a function", () => {
		(typeof putMethodResponseStep).should.equal("function");
	});

	describe("(parameters)", () => {
		beforeEach(done => {
			putMethodResponseStep(conan, context, () => {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS call", () => {
			putMethodResponseSpy.firstCall.args[0].should.eql({
				resourceId: apiResourceId,
				httpMethod: parameters.method(),
				restApiId,
				statusCode: "200",
				responseParameters: {}
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
			putMethodResponseSpy = sinon.spy();
		});

		it("should skip the function call entirely", done => {
			putMethodResponseStep(conan, context, () => {
				putMethodResponseSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(the status code is present on the array)", () => {
		beforeEach(() => {
			parameters = new class MockConanAwsParameters {
				method() { return "GET"; }
				statusCodes() { return [200, 404]; }
			}();

			restApiId = "23sysh";
			apiResourceId = "23sysh3";

			context = {
				parameters,
				results: {
					restApiId,
					apiResourceId,
					responseStatusCodes: ["200"]
				},
				libraries: {
					AWS: {
						APIGateway
					}
				}
			};

			putMethodResponseSpy = sinon.spy((params, callback) => {
				callback(null, {});
			});
		});

		it("should skip the function call for it", done => {
			putMethodResponseStep(conan, context, () => {
				putMethodResponseSpy.firstCall.args[0].statusCode.should.equal("404");
				done();
			});
		});
	});

	describe("(method response created)", () => {
		let responseData;

		beforeEach(() => {
			responseData = {};
			putMethodResponseSpy = sinon.spy((awsParameters, callback) => {
				callback(null, responseData);
			});
		});

		it("should not return an error", done => {
			putMethodResponseStep(conan, context, (error) => {
				should.not.exist(error);
				done();
			});
		});
	});

	describe("(api resource id is not present)", () => {
		beforeEach(() => {
			delete context.results.apiResourceId;
			putMethodResponseSpy = sinon.spy();
		});

		it("should skip the function call entirely", done => {
			putMethodResponseStep(conan, context, () => {
				putMethodResponseSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(unknown error)", () => {
		beforeEach(() => {
			putMethodResponseSpy = sinon.spy((params, callback) => {
				callback({ statusCode: 401 });
			});
		});

		it("should return an error when is just one", done => {
			putMethodResponseStep(conan, context, (error) => {
				should.exist(error);
				done();
			});
		});
	});
});
