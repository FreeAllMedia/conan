import Conan from "../../../conan.js";
import ConanAwsLambdaPlugin from "../conan.aws-lambda.plugin.js";

describe("ConanAwsLambdaPlugin(conan)", () => {
  it("should create a lambda builder function at conan.lambda()", () => {
		const conan = new Conan();
		conan.use(ConanAwsLambdaPlugin);

		(typeof conan.lambda).should.eql("function");
	});
});
