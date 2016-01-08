import Conan from "../../../../conan.js";
import sinon from "sinon";
import chai from "chai";
import createResourceMethodStep from "../../steps/createResourceMethodStep.js";

describe("createResourceMethodStep", () => {
	let putMethodSpy,
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

		putMethod(params, callback) {
			putMethodSpy(params, callback);
		}
	}

	beforeEach(() => {
		conan = new Conan({
			region: "us-east-1"
		});

		constructorSpy = sinon.spy();
		putMethodSpy = sinon.spy((params, callback) => {
			callback();
		});
		should = chai.should();

		parameters = new class MockConanAwsParameters {
			method() { return "GET"; }
		}();

		restApiId = "23sysh";
		apiResourceId = "23sysh3";

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
		(typeof createResourceMethodStep).should.equal("function");
	});

	describe("(parameters)", () => {
		beforeEach(done => {
			createResourceMethodStep(conan, context, () => {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS create deployment call", () => {
			putMethodSpy.firstCall.args[0].should.eql({
				resourceId: apiResourceId,
				httpMethod: parameters.method(),
				restApiId
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
			putMethodSpy = sinon.spy();
		});

		it("should skip the function call entirely", done => {
			createResourceMethodStep(conan, context, () => {
				putMethodSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(resource method created)", () => {
		let responseData;

		beforeEach(() => {
			responseData = { httpMethod: "GET" };
			putMethodSpy = sinon.spy((awsParameters, callback) => {
				callback(null, responseData);
			});
		});

		it("should return the resource http method", done => {
			createResourceMethodStep(conan, context, (error, result) => {
				result.resourceHttpMethod.should.equal(responseData.httpMethod);
				done();
			});
		});
	});

	describe("(api resource id is not present)", () => {
		beforeEach(() => {
			delete context.results.apiResourceId;
			putMethodSpy = sinon.spy();
		});

		it("should skip the function call entirely", done => {
			createResourceMethodStep(conan, context, () => {
				putMethodSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(unknown error)", () => {
		beforeEach(() => {
			putMethodSpy = sinon.spy((params, callback) => {
				callback({ statusCode: 401 });
			});
		});

		it("should return an error when is just one", done => {
			createResourceMethodStep(conan, context, (error) => {
				should.exist(error);
				done();
			});
		});
	});
});
