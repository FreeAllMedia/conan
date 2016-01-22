import Conan from "../../../../conan.js";
import createLambdaAliasStep from "../../steps/createLambdaAliasStep.js";
import sinon from "sinon";

describe(".createLambdaAliasStep(conan, context, stepDone)", () => {
	let conan,
			context,
			stepDone,

			awsResponseError,
			aliasArn,
			functionVersion,

			responseData,

			stepReturnError,
			stepReturnData,

			parameters;

	let mockLambda = {
		createAlias: sinon.spy((params, callback) => {
			callback(awsResponseError, responseData(params));
		})
	};

	let MockAWS = {
		Lambda: sinon.spy(() => {
			return mockLambda;
		})
	};

	beforeEach(() => {
		conan = new Conan({
			region: "us-east-1"
		});

		parameters = new class MockConanAwsLambda {
			name() { return "TestFunction"; }
			alias() { return [["development"], ["production", "1"]]; }
		}();

		aliasArn = "arn:aws:lambda:aws-regions:accct-id:function:example:alias";
		functionVersion = "version";

		context = {
			parameters: parameters,
			libraries: { AWS: MockAWS },
			results: {
			}
		};

		awsResponseError = null;

		responseData = sinon.stub();
		responseData.returns({AliasArn: aliasArn, FunctionVersion: functionVersion});
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

			createLambdaAliasStep(conan, context, stepDone(done));
		});

		it("should be a function", () => {
			(typeof createLambdaAliasStep).should.equal("function");
		});

		it("should set the designated region on the lambda client", () => {
			MockAWS.Lambda.calledWith({
				region: conan.config.region
			}).should.be.true;
		});

		it("should call AWS with the designated function name parameter", () => {
			mockLambda.createAlias.calledWith({
				"FunctionName": context.parameters.name(),
				"FunctionVersion": "$LATEST",
				"Description": "conan auto created alias",
				"Name": "development"
			}).should.be.true;
		});

		describe("(Alias Create Request for Every Alias)", () => {
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
				createLambdaAliasStep(conan, context, stepDone(done));
			});

			it("should return the alias arn", () => {
				stepReturnData.should.eql({
					aliases: {
						"development-all": {
							aliasArn,
							functionVersion
						},
						"production-all": {
							aliasArn,
							functionVersion
						}
					}
				});
			});
		});

		describe("(Alias Create Request for Some Alias)", () => {
			beforeEach(done => {
				parameters = new class MockConanAwsLambda {
					name() { return "TestFunction"; }
					alias() { return [["development-some"], ["production-some", "2"], ["staging-some", "1"]]; }
				}();

				context = {
					parameters: parameters,
					libraries: { AWS: MockAWS },
					results: {
						aliases: {
							"development-some": {
								aliasArn,
								functionVersion: "$LATEST"
							},
							"staging-some": {
								aliasArn
							}
						}
					}
				};
				createLambdaAliasStep(conan, context, stepDone(done));
			});

			it("should return the alias arn", () => {
				stepReturnData.should.eql({
					aliases: {
						"production-some": {
							aliasArn,
							functionVersion
						}
					}
				});
			});
		});

		describe("(Alias No Create Request made)", () => {
			beforeEach(done => {
				parameters = new class MockConanAwsLambda {
					alias() { return [["development"], ["production", "1"]]; }
				}();

				context = {
					parameters: parameters,
					libraries: { AWS: MockAWS },
					results: {
						aliases: {
							"development": { aliasArn, functionVersion },
							"production": { aliasArn, functionVersion }
						}
					}
				};
				createLambdaAliasStep(conan, context, stepDone(done));
			});

			it("should return the alias arn", () => {
				stepReturnData.should.eql({ aliases: {} });
			});
		});

		describe("(Unknown Error is Returned)", () => {
			let errorMessage;

			beforeEach(done => {
				parameters = new class MockConanAwsLambda {
					name() { return "TestFunction"; }
					alias() { return [["development-some"], ["production-some", "1"]]; }
				}();

				context = {
					parameters: parameters,
					libraries: { AWS: MockAWS },
					results: {
						aliases: {
							"development-some": { aliasArn, functionVersion }
						}
					}
				};
				errorMessage = "AWS returned status code 401";
				awsResponseError = { statusCode: 401, message: errorMessage };
				mockLambda.createAlias = sinon.spy((params, callback) => {
					callback(awsResponseError, null);
				});
				createLambdaAliasStep(conan, context, stepDone(done));
			});

			it("should return an error which stops the step runner", () => {
				stepReturnError.message.should.eql(errorMessage);
			});
		});
	});
});
