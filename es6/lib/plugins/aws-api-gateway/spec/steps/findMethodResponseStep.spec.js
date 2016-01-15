import Conan from "../../../../conan.js";
import sinon from "sinon";
import chai from "chai";
import findMethodResponseStep from "../../steps/findMethodResponseStep.js";

describe("findMethodResponseStep", () => {
	let getMethodResponseSpy,
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

		getMethodResponse(params, callback) {
			getMethodResponseSpy(params, callback);
		}
	}

	beforeEach(() => {
		conan = new Conan({
			region: "us-east-1"
		});

		constructorSpy = sinon.spy();
		getMethodResponseSpy = sinon.spy((params, callback) => {
			callback();
		});
		should = chai.should();

		parameters = new class MockConanAwsParameters {
			method() { return "GET"; }
			statusCodes() { return {"200": "", "404": "Not Found*"}; }
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
		(typeof findMethodResponseStep).should.equal("function");
	});

	describe("(parameters)", () => {
		beforeEach(done => {
			findMethodResponseStep(conan, context, () => {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS get function call", () => {
			getMethodResponseSpy.firstCall.args[0].should.eql({
				httpMethod: parameters.method(),
				resourceId: context.results.apiResourceId,
				restApiId,
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
			getMethodResponseSpy = sinon.spy();
		});

		it("should skip the function call entirely", done => {
			findMethodResponseStep(conan, context, () => {
				getMethodResponseSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(api resource id is not present)", () => {
		beforeEach(() => {
			delete context.results.apiResourceId;
			getMethodResponseSpy = sinon.spy();
		});

		it("should skip the function call entirely", done => {
			findMethodResponseStep(conan, context, () => {
				getMethodResponseSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(no response methods not found)", () => {
		beforeEach(() => {
			getMethodResponseSpy = sinon.spy((params, callback) => {
				callback({ statusCode: 404 });
			});
		});

		it("should return no error", done => {
			findMethodResponseStep(conan, context, (error) => {
				should.not.exist(error);
				done();
			});
		});

		it("should return an emtpy array on status codes", done => {
			findMethodResponseStep(conan, context, (error, result) => {
				result.responseStatusCodes.should.eql([]);
				done();
			});
		});
	});

	describe("(response method found)", () => {
		let responseData;

		beforeEach(() => {
			responseData = {statusCode: "200"};
			getMethodResponseSpy = sinon.spy((params, callback) => {
				callback(null, responseData);
			});
		});

		it("should return the status codes", done => {
			findMethodResponseStep(conan, context, (error, result) => {
				result.responseStatusCodes.should.eql(["200", "200"]);
				done();
			});
		});
	});

	describe("(unknown error)", () => {
		beforeEach(() => {
			getMethodResponseSpy = sinon.spy((params, callback) => {
				callback({ statusCode: 401 });
			});
		});

		it("should return error", done => {
			findMethodResponseStep(conan, context, (error) => {
				should.exist(error);
				done();
			});
		});
	});
});
