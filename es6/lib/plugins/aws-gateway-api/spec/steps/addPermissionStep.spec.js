import Conan from "../../../../conan.js";
import sinon from "sinon";
import chai from "chai";
import addPermissionStep from "../../steps/addPermissionStep.js";

describe("addPermissionStep", () => {
	let addPermissionSpy,
		constructorSpy,
		conan,
		context,
		parameters,
		restApiId,
		should;

	class Lambda {
		constructor(constructorParameters) {
			constructorSpy(constructorParameters);
		}

		addPermission(params, callback) {
			addPermissionSpy(params, callback);
		}
	}

	beforeEach(() => {
		conan = new Conan({
			region: "us-east-1"
		});

		constructorSpy = sinon.spy();
		addPermissionSpy = sinon.spy((params, callback) => {
			callback();
		});
		should = chai.should();

		restApiId = "283mds2";

		parameters = new class MockConanAwsParameters {
			lambda() { return "listAccountItems"; }
		}();

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

		it("should send the appropiate parameters to the AWS call", () => {
			addPermissionSpy.firstCall.args[0].should.eql({
				// SourceArn: `arn:aws:apigateway:us-east-1::/restapis/${restApiId}/*`,
				Action: "lambda:InvokeFunction",
				Principal: "apigateway.amazonaws.com",
				FunctionName: "listAccountItems",
				StatementId: "1"
			});
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

	describe("(lambda is not present)", () => {
		beforeEach(() => {
			parameters = new class MockConanAwsParameters {
			}();

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

	// commented until specific permissions to resource or rest api
	// describe("(rest api id is not present)", () => {
	// 	beforeEach(() => {
	// 		delete context.results.restApiId;
	// 		addPermissionSpy = sinon.spy();
	// 	});
	//
	// 	it("should skip the function call entirely", done => {
	// 		addPermissionStep(conan, context, () => {
	// 			addPermissionSpy.called.should.be.false;
	// 			done();
	// 		});
	// 	});
	// });

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
