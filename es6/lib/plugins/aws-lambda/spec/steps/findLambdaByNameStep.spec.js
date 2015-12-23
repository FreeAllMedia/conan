import rewire from "rewire";
import sinon from "sinon";
import chai from "chai";
import Conan from "../../../../conan.js";
const conanFindLambdaByNameStep = rewire("../../steps/findLambdaByNameStep.js");

describe("findLambdaByNameStep", () => {
	let awsSpy,
		conan,
		context,
		should;

	before(() => {
		should = chai.should();
		context = {
			parameters: {
				name: "test Lambda"
			}
		};
		conan = new Conan({"region": "us-east-1"});
	});

	it("should be a function", () => {
		(typeof conanFindLambdaByNameStep).should.equal("function");
	});

	describe("(parameters)", () => {
		let revertRewiredConstructor;
		let expectedFunctionParameters;
		let expectedConstructorParameters;
		let constructorSpy;

		beforeEach(done => {
			awsSpy = sinon.spy((params, callback) => {
				callback({statusCode: 404});
			});

			expectedFunctionParameters = {
				FunctionName: context.parameters.name
			};

			expectedConstructorParameters = {
				region: "us-east-1"
			};

			constructorSpy = sinon.spy();

			revertRewiredConstructor = conanFindLambdaByNameStep.__set__("LambdaConstructor",
				(constructorParameters) => {
					constructorSpy(constructorParameters);
					return {
						getFunction: awsSpy
					};
				}
			);

			conanFindLambdaByNameStep(conan, context, () => {
				done();
			});
		});

		afterEach(() => {
			revertRewiredConstructor();
		});

		it("should send the ", () => {
			awsSpy.firstCall.args[0].should.eql(expectedFunctionParameters);
		});

		it("should set the constructor parameters", () => {
			constructorSpy.firstCall.args[0].should.eql(expectedConstructorParameters);
		});
	});

	describe("(lambda not found)", () => {
		let revertRewiredConstructor;

		beforeEach(() => {
			awsSpy = sinon.spy((params, callback) => {
				callback({statusCode: 404});
			});

			revertRewiredConstructor = conanFindLambdaByNameStep.__set__("LambdaConstructor",
				() => {
					return {
						getFunction: awsSpy
					};
				}
			);
		});

		afterEach(() => {
			revertRewiredConstructor();
		});

		it("should return false for that lambda", done => {
			conanFindLambdaByNameStep(conan, context, (error, result) => {
				result.lambda.found.should.equal(false);
				done();
			});
		});
	});

	describe("(lambda found)", () => {
		let revertRewiredConstructor;
		let responseData;

		beforeEach(() => {
			responseData = {Configuration: {}};
			awsSpy = sinon.spy((params, callback) => {
				callback(null, responseData);
			});

			revertRewiredConstructor = conanFindLambdaByNameStep.__set__("LambdaConstructor",
				() => {
					return {
						getFunction: awsSpy
					};
				}
			);
		});

		afterEach(() => {
			revertRewiredConstructor();
		});

		it("should return true for that lambda", done => {
			conanFindLambdaByNameStep(conan, context, (error, result) => {
				result.lambda.found.should.equal(true);
				done();
			});
		});

		it("should return the response data for the lambda", done => {
			conanFindLambdaByNameStep(conan, context, (error, result) => {
				result.lambda.response.should.eql(responseData);
				done();
			});
		});
	});

	describe("(unknown error)", () => {
		let revertRewiredConstructor;

		beforeEach(() => {
			awsSpy = sinon.spy((params, callback) => {
				callback({statusCode: 401});
			});

			revertRewiredConstructor = conanFindLambdaByNameStep.__set__("LambdaConstructor",
				() => {
					return {
						getFunction: awsSpy
					};
				}
			);
		});

		afterEach(() => {
			revertRewiredConstructor();
		});

		it("should return error", done => {
			conanFindLambdaByNameStep(conan, context, (error) => {
				should.exist(error);
				done();
			});
		});
	});
});
