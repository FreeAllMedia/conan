import Conan from "../../../../conan.js";
import sinon from "sinon";
import chai from "chai";
import createApiStep from "../../steps/createApiStep.js";

describe("createApiStep", () => {
	let createRestApiSpy,
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

		createRestApi(params, callback) {
			createRestApiSpy(params, callback);
		}
	}

	beforeEach(() => {
		conan = new Conan({
			region: "us-east-1"
		});

		constructorSpy = sinon.spy();
		createRestApiSpy = sinon.spy((params, callback) => {
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
			},
			libraries: {
				AWS: {
					APIGateway
				}
			}
		};
	});

	it("should be a function", () => {
		(typeof createApiStep).should.equal("function");
	});

	describe("(parameters)", () => {
		beforeEach(done => {
			createApiStep(conan, context, () => {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS get function call", () => {
			createRestApiSpy.firstCall.args[0].should.eql({
				name: "testApi"
			});
		});

		it("should set the constructor parameters", () => {
			constructorSpy.firstCall.args[0].should.eql({
				region: conan.config.region
			});
		});
	});

	describe("(api id is present)", () => {
		beforeEach(() => {
			context.results = { restApiId };
			createRestApiSpy = sinon.spy();
		});

		it("should skip the function call entirely", done => {
			createApiStep(conan, context, () => {
				createRestApiSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(api created)", () => {
		let responseData;

		beforeEach(() => {
			responseData = {name: "testApi", id: 2};
			createRestApiSpy = sinon.spy((params, callback) => {
				callback(null, responseData);
			});
		});

		it("should return with no error for that api", done => {
			createApiStep(conan, context, (error) => {
				should.not.exist(error);
				done();
			});
		});

		it("should return the id", done => {
			createApiStep(conan, context, (error, result) => {
				result.restApiId.should.equal(2);
				done();
			});
		});
	});

	describe("(unknown error)", () => {
		beforeEach(() => {
			createRestApiSpy = sinon.spy((params, callback) => {
				callback({ statusCode: 401 });
			});
		});

		it("should return error", done => {
			createApiStep(conan, context, (error) => {
				should.exist(error);
				done();
			});
		});
	});
});
