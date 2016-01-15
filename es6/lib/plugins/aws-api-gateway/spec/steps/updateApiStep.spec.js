import Conan from "../../../../conan.js";
import sinon from "sinon";
import chai from "chai";
import updateApiStep from "../../steps/updateApiStep.js";

describe("updateApiStep", () => {
	let updateRestApiSpy,
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

		updateRestApi(params, callback) {
			updateRestApiSpy(params, callback);
		}
	}

	beforeEach(() => {
		conan = new Conan({
			region: "us-east-1"
		});

		constructorSpy = sinon.spy();
		updateRestApiSpy = sinon.spy((params, callback) => {
			callback();
		});
		should = chai.should();

		parameters = new class MockConanAwsParameters {
			name() { return "testApi"; }
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
		(typeof updateApiStep).should.equal("function");
	});

	describe("(parameters)", () => {
		beforeEach(done => {
			updateApiStep(conan, context, () => {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS get function call", () => {
			updateRestApiSpy.firstCall.args[0].should.eql({
				restApiId,
				patchOperations: [
					{
						op: "replace",
						path: "/name",
						value: "testApi"
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

	describe("(api id not present)", () => {
		beforeEach(() => {
			delete context.results.restApiId;
			updateRestApiSpy = sinon.spy();
		});

		it("should skip the function call entirely", done => {
			updateApiStep(conan, context, () => {
				updateRestApiSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(api updated)", () => {
		let responseData;
		let matchingApi;

		beforeEach(() => {
			matchingApi = {name: "testApi", id: 2};
			responseData = {matchingApi};
			updateRestApiSpy = sinon.spy((params, callback) => {
				callback(null, responseData);
			});
		});

		it("should return with no error for that api", done => {
			updateApiStep(conan, context, (error) => {
				should.not.exist(error);
				done();
			});
		});
	});

	describe("(unknown error)", () => {
		beforeEach(() => {
			updateRestApiSpy = sinon.spy((params, callback) => {
				callback({ statusCode: 401 });
			});
		});

		it("should return error", done => {
			updateApiStep(conan, context, (error) => {
				should.exist(error);
				done();
			});
		});
	});
});
