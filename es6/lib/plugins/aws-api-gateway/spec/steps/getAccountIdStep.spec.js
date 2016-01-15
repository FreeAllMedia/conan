import Conan from "../../../../conan.js";
import sinon from "sinon";
import chai from "chai";
import getAccountIdStep from "../../steps/getAccountIdStep.js";

describe("getAccountIdStep", () => {
	let getUserSpy,
		constructorSpy,
		conan,
		context,
		accountId,
		should;

	class IAM {
		constructor(constructorParameters) {
			constructorSpy(constructorParameters);
		}

		getUser(params, callback) {
			getUserSpy(params, callback);
		}
	}

	beforeEach(() => {
		conan = new Conan({
			region: "us-east-1"
		});

		accountId = "12787444639";

		constructorSpy = sinon.spy();
		getUserSpy = sinon.spy((params, callback) => {
			callback(null, {User: {Arn: `aws:arn:iam::${accountId}:user/division_abc/subdivision_xyz/Bob`}});
		});
		should = chai.should();

		context = {
			libraries: {
				AWS: {
					IAM
				}
			}
		};
	});

	it("should be a function", () => {
		(typeof getAccountIdStep).should.equal("function");
	});

	describe("(parameters)", () => {
		beforeEach(done => {
			getAccountIdStep(conan, context, () => {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS get function call", () => {
			getUserSpy.firstCall.args[0].should.eql({});
		});

		it("should set the constructor parameters", () => {
			constructorSpy.firstCall.args[0].should.eql({
				region: conan.config.region
			});
		});
	});

	describe("(account id found)", () => {
		it("should not return no error", done => {
			getAccountIdStep(conan, context, (error) => {
				should.not.exist(error);
				done();
			});
		});

		it("should return the account id", done => {
			getAccountIdStep(conan, context, (error, results) => {
				results.accountId.should.equal(accountId);
				done();
			});
		});
	});

	describe("(unknown error)", () => {
		beforeEach(() => {
			getUserSpy = sinon.spy((params, callback) => {
				callback({ statusCode: 401 });
			});
		});

		it("should return error", done => {
			getAccountIdStep(conan, context, (error) => {
				should.exist(error);
				done();
			});
		});
	});
});
