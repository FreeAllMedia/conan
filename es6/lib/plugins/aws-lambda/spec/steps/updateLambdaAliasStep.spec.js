import Conan from "../../../../conan.js";
import updateLambdaAliasStep from "../../steps/updateLambdaAliasStep.js";
import sinon from "sinon";

describe(".updateLambdaAliasStep(conan, context, stepDone)", () => {
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
		updateAlias: sinon.spy((params, callback) => {
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
				aliases: {
					"development": {},
					"production": {}
				}
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

			updateLambdaAliasStep(conan, context, stepDone(done));
		});

		it("should be a function", () => {
			(typeof updateLambdaAliasStep).should.equal("function");
		});

		it("should set the designated region on the lambda client", () => {
			MockAWS.Lambda.calledWith({
				region: conan.config.region
			}).should.be.true;
		});

		it("should call AWS with the designated function name parameter", () => {
			mockLambda.updateAlias.calledWith({
				"FunctionName": context.parameters.name(),
				"FunctionVersion": "$LATEST",
				"Description": "conan auto updated alias",
				"Name": "development"
			}).should.be.true;
		});

		describe("(Alias Update Request for Every Alias)", () => {
			beforeEach(done => {
				parameters = new class MockConanAwsLambda {
					name() { return "TestFunction"; }
					alias() { return [["development-all"], ["production-all", "1"]]; }
				}();

				context = {
					parameters: parameters,
					libraries: { AWS: MockAWS },
					results: {
						aliases: {
							"development-all": {
								aliasArn
							},
							"production-all": {
								aliasArn
							}
						}
					}
				};
				updateLambdaAliasStep(conan, context, stepDone(done));
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

		describe("(Alias Update Request for Some Alias)", () => {
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
								functionVersion: "version"
							},
							"staging-some": {
								aliasArn
							},
							"production-some": {
								aliasArn
							}
						}
					}
				};
				updateLambdaAliasStep(conan, context, stepDone(done));
			});

			it("should return the alias arn", () => {
				stepReturnData.should.eql({
					aliases: {
						"production-some": {
							aliasArn,
							functionVersion
						},
						"staging-some": {
							aliasArn,
							functionVersion
						},
						"development-some": {
							aliasArn,
							functionVersion
						}
					}
				});
			});
		});

		describe("(Alias No Update Request made)", () => {
			let aliases;
			beforeEach(done => {
				parameters = new class MockConanAwsLambda {
					alias() { return [["development"], ["production", "1"]]; }
				}();
				aliases = {
					"development": { aliasArn, functionVersion },
					"production": { aliasArn, functionVersion }
				};

				context = {
					parameters: parameters,
					libraries: { AWS: MockAWS },
					results: {
						aliases
					}
				};
				updateLambdaAliasStep(conan, context, stepDone(done));
			});

			it("should return the alias arn", () => {
				stepReturnData.should.eql({ aliases });
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
							"development-some": { aliasArn },
							"production-some": { aliasArn, functionVersion }
						}
					}
				};
				errorMessage = "AWS returned status code 401";
				awsResponseError = { statusCode: 401, message: errorMessage };
				mockLambda.updateAlias = sinon.spy((params, callback) => {
					callback(awsResponseError, null);
				});
				updateLambdaAliasStep(conan, context, stepDone(done));
			});

			it("should return an error which stops the step runner", () => {
				stepReturnError.message.should.eql(errorMessage);
			});
		});
	});
});
