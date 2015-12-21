import Conan from "../../../conan.js";
import ConanAwsLambda from "../components/conanAwsLambda.js";
import ConanAwsLambdaPlugin from "../conan.aws-lambda.plugin.js";

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

	describe("conan.lambda(name, handlerPath)", () => {
		let lambda;
		let name;
		let handler;

		beforeEach(() => {
			name = "AccountCreate";
			handler = "handler";

			lambda = conan.lambda(name, handler);
		});

		it("should return an instance of ConanAwsLambda", () => {
			lambda.should.be.instanceOf(ConanAwsLambda);
		});

		it("should pass conan to the ConanAwsLambda constructor", () => {
			lambda.conan.should.eql(conan);
		});

		it("should pass the lambda name to the ConanAwsLambda constructor", () => {
			lambda.parameters.name.should.eql(name);
		});

		it("should pass the lambda handler to the ConanAwsLambda constructor", () => {
			lambda.parameters.handler.should.eql(handler);
		});
	});
});
