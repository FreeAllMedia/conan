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
		let path;
		let handler;

		beforeEach(() => {
			name = "AccountCreate";
			path = "/account/create";
			handler = "handler";

			lambda = conan.lambda(name, path, handler);
		});

		it("should return an instance of ConanAwsLambda", () => {
			lambda.should.be.instanceOf(ConanAwsLambda);
		});

		it("should pass conan to the ConanAwsLambda constructor", () => {
			lambda.properties.conan.should.eql(conan);
		});

		it("should pass the lambda name to the ConanAwsLambda constructor", () => {
			lambda.properties.name.should.eql(name);
		});

		it("should pass the lambda path to the ConanAwsLambda constructor", () => {
			lambda.properties.path.should.eql(path);
		});

		it("should pass the lambda handler to the ConanAwsLambda constructor", () => {
			lambda.properties.handler.should.eql(handler);
		});
	});
});
