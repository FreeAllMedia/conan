import Conan from "../../../conan.js";
import ConanAwsLambda from "../components/conanAwsLambda.js";
import ConanAwsLambdaPlugin from "../conanAwsLambdaPlugin.js";
import sinon from "sinon";
import AWS from "aws-sdk";

describe("ConanAwsLambdaPlugin(conan)", () => {
	let conan;

	beforeEach(() => {
		conan = new Conan();
		conan.use(ConanAwsLambdaPlugin);
	});

	it("should set conan.config.region to 'us-east-1' if not already set", () => {
		conan.config.region.should.eql("us-east-1");
	});

	it("should NOT set conan.config.region to 'us-east-1' if already set", () => {
		conan = new Conan({
			region: "us-west-2"
		});
		conan.use(ConanAwsLambdaPlugin);
		conan.config.region.should.eql("us-west-2");
	});

  it("should setup conan.lambda()", () => {
		(typeof conan.lambda).should.eql("function");
	});

	it("should setup an empty object to hold lambdas at conan.lambdas", () => {
		conan.lambdas.should.eql({});
	});

	describe("(AWS)", () => {
		before(() => {
			conan = new Conan();
			conan.steps.constructor.prototype.library = sinon.spy(conan.steps.constructor.prototype.library);
			conan.use(ConanAwsLambdaPlugin);
		});

		it("should add the AWS library", () => {
			conan.steps.library.calledWith("AWS", AWS).should.be.true;
		});
	});

	describe("conan.lambda(name, handlerPath)", () => {
		let lambda;
		let name;
		let filePath;
		let handler;

		beforeEach(() => {
			name = "AccountCreate";
			filePath = "/account/create";
			handler = "handler";

			lambda = conan.lambda(name, filePath, handler);
		});

		it("should return an instance of ConanAwsLambda", () => {
			lambda.should.be.instanceOf(ConanAwsLambda);
		});

		it("should pass conan to the ConanAwsLambda constructor", () => {
			lambda.conan.should.eql(conan);
		});

		it("should pass the lambda name to the ConanAwsLambda constructor", () => {
			lambda.name().should.eql(name);
		});

		it("should pass the lambda file path to the ConanAwsLambda constructor", () => {
			lambda.filePath().should.eql(filePath);
		});

		it("should pass the lambda handler to the ConanAwsLambda constructor", () => {
			lambda.handler().should.eql([handler]);
		});
	});
});
