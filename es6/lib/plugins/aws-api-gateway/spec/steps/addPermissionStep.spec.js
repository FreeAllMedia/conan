import Conan from "../../../../conan.js";
import sinon from "sinon";
import chai from "chai";
import addPermissionStep from "../../steps/addPermissionStep.js";

describe("addPermissionStep", () => {
	let addPermissionSpy,
		getPolicySpy,
		constructorSpy,
		conan,
		context,
		parameters,
		restApiId,
		accountId,
		should;

	class Lambda {
		constructor(constructorParameters) {
			constructorSpy(constructorParameters);
		}

		getPolicy(params, callback) {
			getPolicySpy(params, callback);
		}

		addPermission(params, callback) {
			addPermissionSpy(params, callback);
		}
	}

	beforeEach(() => {
		conan = new Conan({
			region: "us-east-1"
		});

		restApiId = "283mds2";
		accountId = "2293892861";

		constructorSpy = sinon.spy();
		addPermissionSpy = sinon.spy((params, callback) => {
			callback();
		});
		getPolicySpy = sinon.spy((params, callback) => {
			callback(null, {
				"Policy": "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Condition\":{\"ArnLike\":{\"AWS:SourceArn\":\"arn:wrong:execute-api:us-east-1:2293892861:283mds2/*/GET/accounts/items\"}},\"Action\":\"lambda:InvokeFunction\",\"Resource\":\"arn:aws:lambda:us-east-1:166191841105:function:ListAccounts\",\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"apigateway.amazonaws.com\"},\"Sid\":\"89d8cf5e-28f5-498b-8d87-d3eb2073115e\"}],\"Id\":\"default\"}"
			});
		});
		should = chai.should();

		parameters = new class MockConanAwsParameters {
			path() { return "/accounts/items"; }
			lambda() { return "listAccountItems"; }
			method() { return "GET"; }
		}();

		context = {
			parameters,
			results: {
				restApiId,
				accountId
			},
			libraries: {
				AWS: {
					Lambda
				}
			}
		};
	});

	it("should be a function", () => {
		(typeof addPermissionStep).should.equal("function");
	});

	describe("(parameters)", () => {
		beforeEach(done => {
			addPermissionStep(conan, context, () => {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS get policy call", () => {
			getPolicySpy.firstCall.args[0].should.eql({
				FunctionName: "listAccountItems"
			});
		});

		it("should send the appropiate parameters to the AWS call", () => {
			const parametersSent = addPermissionSpy.firstCall.args[0];
			//because it's an auto generated uuid, tested separately
			delete parametersSent.StatementId;
			parametersSent.should.eql({
				SourceArn: `arn:aws:execute-api:us-east-1:${accountId}:${restApiId}/*/GET/accounts/items`,
				Action: "lambda:InvokeFunction",
				Principal: "apigateway.amazonaws.com",
				FunctionName: "listAccountItems"
			});
		});

		it("should generated an uuid on the parameters", () => {
			addPermissionSpy.firstCall.args[0].should.have.property("StatementId");
		});

		it("should set the constructor parameters", () => {
			constructorSpy.firstCall.args[0].should.eql({
				region: conan.config.region
			});
		});
	});

	describe("(permission added)", () => {
		let responseData;

		beforeEach(() => {
			responseData = {};
			addPermissionSpy = sinon.spy((awsParameters, callback) => {
				callback(null, responseData);
			});
		});

		it("should return with no error", done => {
			addPermissionStep(conan, context, (error) => {
				should.not.exist(error);
				done();
			});
		});
	});

	describe("(a parameter is not present)", () => {
		beforeEach(() => {
			parameters = {};

			context = {
				parameters,
				results: {
					restApiId,
					accountId
				},
				libraries: {
					AWS: {
						Lambda
					}
				}
			};
			addPermissionSpy = sinon.spy();
		});

		it("should skip the function call entirely", done => {
			addPermissionStep(conan, context, () => {
				addPermissionSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(get policy paths)", () => {
		describe("(permission already set)", () => {
			beforeEach(done => {
				getPolicySpy = sinon.spy((params, callback) => {
					callback(null, {
						"Policy": "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Condition\":{\"ArnLike\":{\"AWS:SourceArn\":\"arn:aws:execute-api:us-east-1:2293892861:283mds2/*/GET/accounts/items\"}},\"Action\":\"lambda:InvokeFunction\",\"Resource\":\"arn:aws:lambda:us-east-1:166191841105:function:ListAccounts\",\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"apigateway.amazonaws.com\"},\"Sid\":\"89d8cf5e-28f5-498b-8d87-d3eb2073115e\"}],\"Id\":\"default\"}"
					});
				});
				addPermissionSpy = sinon.spy();
				addPermissionStep(conan, context, () => {
					done();
				});
			});

			it("should skip the call to add permission", () => {
				addPermissionSpy.called.should.be.false;
			});

			it("should call to get policy", () => {
				getPolicySpy.called.should.be.true;
			});
		});

		describe("(get policy return error)", () => {
			beforeEach(done => {
				getPolicySpy = sinon.spy((params, callback) => {
					callback({});
				});
				addPermissionSpy = sinon.spy((params, callback) => {
					callback(null, {});
				});
				addPermissionStep(conan, context, () => {
					done();
				});
			});

			it("should call to add permission", () => {
				addPermissionSpy.called.should.be.true;
			});
		});

		describe("(get policy return an invalid json)", () => {
			beforeEach(done => {
				getPolicySpy = sinon.spy((params, callback) => {
					callback(null, {
						"Policy": "{d\"Version\":\"2012-10-17\",\"Statement\":[{\"Condition\":{\"ArnLike\":{\"AWS:SourceArn\":\"arn:aws:execute-api:us-east-1:2293892861:283mds2/*/GET/accounts/items\"}},\"Action\":\"lambda:InvokeFunction\",\"Resource\":\"arn:aws:lambda:us-east-1:166191841105:function:ListAccounts\",\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"apigateway.amazonaws.com\"},\"Sid\":\"89d8cf5e-28f5-498b-8d87-d3eb2073115e\"}],\"Id\":\"default\"}"
					});
				});
				addPermissionSpy = sinon.spy((params, callback) => {
					callback(null, {});
				});
				addPermissionStep(conan, context, () => {
					done();
				});
			});

			it("should call to add permission", () => {
				addPermissionSpy.called.should.be.true;
			});
		});

		describe("(get policy return a json with no source arn like)", () => {
			beforeEach(done => {
				getPolicySpy = sinon.spy((params, callback) => {
					callback(null, {
						"Policy": "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Condition\":{\"SomeProperty\":{\"AWS:SourceArn\":\"arn:aws:execute-api:us-east-1:2293892861:283mds2/*/GET/accounts/items\"}},\"Action\":\"lambda:InvokeFunction\",\"Resource\":\"arn:aws:lambda:us-east-1:166191841105:function:ListAccounts\",\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"apigateway.amazonaws.com\"},\"Sid\":\"89d8cf5e-28f5-498b-8d87-d3eb2073115e\"}],\"Id\":\"default\"}"
					});
				});
				addPermissionSpy = sinon.spy((params, callback) => {
					callback(null, {});
				});
				addPermissionStep(conan, context, () => {
					done();
				});
			});

			it("should call to add permission", () => {
				addPermissionSpy.called.should.be.true;
			});
		});
	});

	describe("(account id is not present)", () => {
		beforeEach(() => {
			context = {
				parameters,
				results: {
					restApiId
				},
				libraries: {
					AWS: {
						Lambda
					}
				}
			};
			addPermissionSpy = sinon.spy();
		});

		it("should skip the function call entirely", done => {
			addPermissionStep(conan, context, () => {
				addPermissionSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(rest api id is not present)", () => {
		beforeEach(() => {
			context = {
				parameters,
				results: {
					accountId
				},
				libraries: {
					AWS: {
						Lambda
					}
				}
			};
			addPermissionSpy = sinon.spy();
		});

		it("should skip the function call entirely", done => {
			addPermissionStep(conan, context, () => {
				addPermissionSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(conflict error or already exists error)", () => {
		beforeEach(() => {
			addPermissionSpy = sinon.spy((params, callback) => {
				callback({ statusCode: 409 });
			});
		});

		it("should return no error -ignore-", done => {
			addPermissionStep(conan, context, (error) => {
				should.not.exist(error);
				done();
			});
		});
	});

	describe("(unknown error)", () => {
		beforeEach(() => {
			addPermissionSpy = sinon.spy((params, callback) => {
				callback({ statusCode: 401 });
			});
		});

		it("should return an error when is just one", done => {
			addPermissionStep(conan, context, (error) => {
				should.exist(error);
				done();
			});
		});
	});
});
