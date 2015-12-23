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

  it("should setup conan.lambda()", () => {
		(typeof conan.lambda).should.eql("function");
	});

	it("should setup an empty object to hold lambdas at conan.lambdas", () => {
		conan.lambdas.should.eql({});
	});

	describe("(AWS)", () => {
		let dependencySpy;
		let fakeConan;

		before(done => {
			dependencySpy = sinon.spy();
			fakeConan = {
				steps: {
					dependency: (name, value) => {
						dependencySpy(name, value);
						done();
					}
				}
			};

			/* eslint-disable no-new */
			new ConanAwsLambdaPlugin(fakeConan);
		});

		it("should add the AWS dependency", () => {
			dependencySpy.calledWith("aws", AWS).should.be.true;
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
			lambda.handler().should.eql(handler);
		});
	});
});
