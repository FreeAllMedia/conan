import Conan from "../../../../conan.js";
import findLambdaAliasStep from "../../steps/findLambdaAliasStep.js";
import sinon from "sinon";
import chai from "chai";

describe(".findLambdaAliasStep(conan, context, stepDone)", () => {
	let conan,
		should,
		context,
		stepDone,

		awsResponseError,
		firstAliasArn,
		secondAliasArn,

		responseData,

		stepReturnError,
		stepReturnData,

		parameters;

	let mockLambda = {
		getAlias: sinon.spy((params, callback) => {
			callback(awsResponseError, responseData(params));
		})
	};

	let MockAWS = {
		Lambda: sinon.spy(() => {
			return mockLambda;
		})
	};

	beforeEach(() => {
		should = chai.should();
		conan = new Conan({
			region: "us-east-1"
		});

		parameters = new class MockConanAwsLambda {
			name() { return "TestFunction"; }
			alias() { return [["development"], ["production", "1"]]; }
		}();

		context = {
			parameters: parameters,
			libraries: { AWS: MockAWS },
			results: {}
		};

		// "Role Found" response by default
		firstAliasArn = "arn:aws:lambda:aws-regions:accct-id:function:example:development";
		secondAliasArn = "arn:aws:lambda:aws-regions:accct-id:function:example:production";

		awsResponseError = null;

		responseData = sinon.stub();
		responseData.withArgs({FunctionName: "TestFunction", Name: "development"})
			.returns({});

		responseData.withArgs({FunctionName: "TestFunction", Name: "production"})
			.returns({});

		responseData.withArgs({FunctionName: "TestFunction", Name: "development-some"})
			.returns({
				AliasArn: firstAliasArn,
				FunctionVersion: "$LATEST"
			});

		responseData.withArgs({FunctionName: "TestFunction", Name: "production-some"})
			.returns({
				AliasArn: secondAliasArn,
				FunctionVersion: "2"
			});

		responseData.withArgs({FunctionName: "TestFunction", Name: "development-all"})
			.returns({
				AliasArn: firstAliasArn,
				FunctionVersion: "$LATEST"
			});

		responseData.withArgs({FunctionName: "TestFunction", Name: "production-all"})
			.returns({
				AliasArn: secondAliasArn,
				FunctionVersion: "1"
			});
	});

	describe("(When calling AWS)", () => {
		beforeEach(done => {
			stepDone = (afterStepCallback) => {
				return (error, data) => {
					stepReturnError = error;
					stepReturnData = data;
					afterStepCallback();
				};
			};

			findLambdaAliasStep(conan, context, stepDone(done));
		});

		it("should be a function", () => {
			(typeof findLambdaAliasStep).should.equal("function");
		});

		it("should set the designated region on the lambda client", () => {
			MockAWS.Lambda.calledWith({
				region: conan.config.region
			}).should.be.true;
		});

		it("should call AWS with the designated function name parameter", () => {
			mockLambda.getAlias.calledWith({
				"FunctionName": context.parameters.name(),
				"Name": "development"
			}).should.be.true;
		});

		describe("(Alias is Found and Updated for Every Alias)", () => {
			beforeEach(done => {
				parameters = new class MockConanAwsLambda {
					name() { return "TestFunction"; }
					alias() { return [["development-all"], ["production-all", "1"]]; }
				}();

				context = {
					parameters: parameters,
					libraries: { AWS: MockAWS },
					results: {}
				};
				findLambdaAliasStep(conan, context, stepDone(done));
			});

			it("should return the alias arn", () => {
				stepReturnData.should.eql({
					aliases: {
						"development-all": {
							aliasArn: firstAliasArn,
							functionVersion: "$LATEST"
						},
						"production-all": {
							aliasArn: secondAliasArn,
							functionVersion: "1"
						}
					}
				});
			});
		});

		describe("(Alias is Found but Updated just for Some Alias)", () => {
			beforeEach(done => {
				parameters = new class MockConanAwsLambda {
					name() { return "TestFunction"; }
					alias() { return [["development-some"], ["production-some", "1"]]; }
				}();

				context = {
					parameters: parameters,
					libraries: { AWS: MockAWS },
					results: {}
				};
				findLambdaAliasStep(conan, context, stepDone(done));
			});

			it("should return the alias arn", () => {
				stepReturnData.should.eql({
					aliases: {
						"development-some": {
							aliasArn: firstAliasArn,
							functionVersion: "$LATEST"
						},
						"production-some": {
							aliasArn: secondAliasArn
						}
					}
				});
			});
		});

		describe("(Alias is not Found)", () => {
			beforeEach(done => {
				parameters = new class MockConanAwsLambda {
					name() { return "TestFunction"; }
					alias() { return [["development"], ["production", "1"]]; }
				}();

				context = {
					parameters: parameters,
					libraries: { AWS: MockAWS },
					results: {}
				};
				findLambdaAliasStep(conan, context, stepDone(done));
			});

			it("should return the alias arn", () => {
				stepReturnData.should.eql({ aliases: {} });
			});
		});

		describe("(Not Found is Returned)", () => {
			let errorMessage;

			beforeEach(() => {
				errorMessage = "AWS returned status code 404";
				awsResponseError = { statusCode: 404, message: errorMessage };
			});

			it("should skip the alias because it does not exist", done => {
				findLambdaAliasStep(conan, context, (error) => {
					should.not.exist(error);
					done();
				});
			});
		});

		describe("(Unknown Error is Returned)", () => {
			let errorMessage;

			beforeEach(done => {
				errorMessage = "AWS returned status code 401";
				awsResponseError = { statusCode: 401, message: errorMessage };
				findLambdaAliasStep(conan, context, stepDone(done));
			});

			it("should return an error which stops the step runner", () => {
				stepReturnError.message.should.eql(errorMessage);
			});
		});
	});
});
