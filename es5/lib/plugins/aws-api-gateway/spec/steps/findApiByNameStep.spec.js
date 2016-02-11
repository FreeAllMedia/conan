import Conan from "../../../../conan.js";
import sinon from "sinon";
import chai from "chai";
import findApiByNameStep from "../../steps/findApiByNameStep.js";

describe("findApiByNameStep", () => {
	let getRestApisSpy,
		constructorSpy,
		conan,
		context,
		parameters,
		should;

	class APIGateway {
		constructor(constructorParameters) {
			constructorSpy(constructorParameters);
		}

		getRestApis(params, callback) {
			getRestApisSpy(params, callback);
		}
	}

	beforeEach(() => {
		conan = new Conan({
			region: "us-east-1"
		});

		constructorSpy = sinon.spy();
		getRestApisSpy = sinon.spy((params, callback) => {
			callback();
		});
		should = chai.should();

		parameters = new class MockConanAwsParameters {
			name() { 				return "testApi"; }
		}();

		context = {
			parameters,
			libraries: {
				AWS: {
					APIGateway
				}
			}
		};
	});

	it("should be a function", () => {
		(typeof findApiByNameStep).should.equal("function");
	});

	describe("(parameters)", () => {
		beforeEach(done => {
			findApiByNameStep(conan, context, () => {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS get function call", () => {
			getRestApisSpy.firstCall.args[0].should.eql({});
		});

		it("should set the constructor parameters", () => {
			constructorSpy.firstCall.args[0].should.eql({
				region: conan.config.region
			});
		});
	});

	describe("(apis returned but not found)", () => {
		let responseData;

		beforeEach(() => {
			responseData = {items: [{name: "testApi1"}, {name: "testApi2"}]};
			getRestApisSpy = sinon.spy((params, callback) => {
				callback(null, responseData);
			});
		});

		it("should return false for that api", done => {
			findApiByNameStep(conan, context, (error) => {
				should.not.exist(error);
				done();
			});
		});

		it("should not return for that api", done => {
			findApiByNameStep(conan, context, (error, result) => {
				should.not.exist(result);
				done();
			});
		});
	});

	describe("(api found)", () => {
		let responseData;
		let matchingApi;

		beforeEach(() => {
			matchingApi = {name: "testApi", id: "asa23k"};
			responseData = {items: [{name: "testApi1"}, matchingApi]};
			getRestApisSpy = sinon.spy((params, callback) => {
				callback(null, responseData);
			});
		});

		it("should return the id for that api", done => {
			findApiByNameStep(conan, context, (error, result) => {
				result.restApiId.should.equal(matchingApi.id);
				done();
			});
		});
	});

	describe("(unknown error)", () => {
		beforeEach(() => {
			getRestApisSpy = sinon.spy((params, callback) => {
				callback({ statusCode: 401 });
			});
		});

		it("should return error", done => {
			findApiByNameStep(conan, context, (error) => {
				should.exist(error);
				done();
			});
		});
	});
});
