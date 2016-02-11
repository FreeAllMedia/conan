import Conan from "../../../../conan.js";
import sinon from "sinon";
import chai from "chai";
import findResourceMethodStep from "../../steps/findResourceMethodStep.js";

describe("findResourceMethodStep", () => {
	let getMethodSpy,
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

		getMethod(params, callback) {
			getMethodSpy(params, callback);
		}
	}

	beforeEach(() => {
		conan = new Conan({
			region: "us-east-1"
		});

		constructorSpy = sinon.spy();
		getMethodSpy = sinon.spy((params, callback) => {
			callback();
		});
		should = chai.should();

		parameters = new class MockConanAwsParameters {
			method() { 				return "GET"; }
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
		(typeof findResourceMethodStep).should.equal("function");
	});

	describe("(parameters)", () => {
		beforeEach(done => {
			findResourceMethodStep(conan, context, () => {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS get function call", () => {
			getMethodSpy.firstCall.args[0].should.eql({
				httpMethod: parameters.method(),
				resourceId: context.results.apiResourceId,
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
			getMethodSpy = sinon.spy();
		});

		it("should skip the function call entirely", done => {
			findResourceMethodStep(conan, context, () => {
				getMethodSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(api resource id is not present)", () => {
		beforeEach(() => {
			delete context.results.apiResourceId;
			getMethodSpy = sinon.spy();
		});

		it("should skip the function call entirely", done => {
			findResourceMethodStep(conan, context, () => {
				getMethodSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(resource method not found)", () => {
		beforeEach(() => {
			getMethodSpy = sinon.spy((params, callback) => {
				callback({ statusCode: 404 });
			});
		});

		it("should return no error", done => {
			findResourceMethodStep(conan, context, (error) => {
				should.not.exist(error);
				done();
			});
		});

		it("should return null as the method name", done => {
			findResourceMethodStep(conan, context, (error, result) => {
				(result.resourceHttpMethod === null).should.be.true;
				done();
			});
		});
	});

	describe("(resource method found)", () => {
		let responseData;

		beforeEach(() => {
			responseData = {httpMethod: "GET"};
			getMethodSpy = sinon.spy((params, callback) => {
				callback(null, responseData);
			});
		});

		it("should return the method name", done => {
			findResourceMethodStep(conan, context, (error, result) => {
				result.resourceHttpMethod.should.equal(responseData.httpMethod);
				done();
			});
		});
	});

	describe("(unknown error)", () => {
		beforeEach(() => {
			getMethodSpy = sinon.spy((params, callback) => {
				callback({ statusCode: 401 });
			});
		});

		it("should return error", done => {
			findResourceMethodStep(conan, context, (error) => {
				should.exist(error);
				done();
			});
		});
	});
});
