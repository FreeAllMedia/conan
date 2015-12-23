import sinon from "sinon";
import chai from "chai";
import findLambdaByNameStep from "../../steps/findLambdaByNameStep.js";

describe("findLambdaByNameStep", () => {
	let getFunctionSpy,
		constructorSpy,
		conan,
		context,
		should;

	class Lambda {
		constructor(parameters) {
			constructorSpy(parameters);
		}

		getFunction(params, callback) {
			getFunctionSpy(params, callback);
		}
	}

	beforeEach(() => {
		constructorSpy = sinon.spy();
		getFunctionSpy = sinon.spy((params, callback) => {
			callback();
		});
		should = chai.should();

		context = {
			parameters: {
				name: "test Lambda"
			},
			dependencies: {
				aws: {
					Lambda
				}
			}
		};

		conan = { config:
			{ "region": "us-east-1" }
		};
	});

	it("should be a function", () => {
		(typeof findLambdaByNameStep).should.equal("function");
	});

	describe("(parameters)", () => {
		beforeEach(done => {
			findLambdaByNameStep(conan, context, () => {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS get function call", () => {
			getFunctionSpy.firstCall.args[0].should.eql({
				FunctionName: context.parameters.name
			});
		});

		it("should set the constructor parameters", () => {
			constructorSpy.firstCall.args[0].should.eql({
				"region": conan.config.region
			});
		});
	});

	describe("(lambda not found)", () => {
		beforeEach(() => {
			getFunctionSpy = sinon.spy((params, callback) => {
				callback({ statusCode: 404 });
			});
		});

		it("should return false for that lambda", done => {
			findLambdaByNameStep(conan, context, (error, result) => {
				result.lambda.found.should.equal(false);
				done();
			});
		});
	});

	describe("(lambda found)", () => {
		let responseData;

		beforeEach(() => {
			responseData = {Configuration: {}};
			getFunctionSpy = sinon.spy((params, callback) => {
				callback(null, responseData);
			});
		});

		it("should return true for that lambda", done => {
			findLambdaByNameStep(conan, context, (error, result) => {
				result.lambda.found.should.equal(true);
				done();
			});
		});

		it("should return the response data for the lambda", done => {
			findLambdaByNameStep(conan, context, (error, result) => {
				result.lambda.response.should.eql(responseData);
				done();
			});
		});
	});

	describe("(unknown error)", () => {
		beforeEach(() => {
			getFunctionSpy = sinon.spy((params, callback) => {
				callback({ statusCode: 401 });
			});
		});

		it("should return error", done => {
			findLambdaByNameStep(conan, context, (error) => {
				should.exist(error);
				done();
			});
		});
	});
});
