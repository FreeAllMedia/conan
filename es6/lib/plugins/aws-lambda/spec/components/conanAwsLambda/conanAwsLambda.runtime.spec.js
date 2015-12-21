import Conan from "../../../../../conan.js";
import ConanAwsLambda from "../../../components/conanAwsLambda.js";

describe("conanAwsLambda.runtime(name)", () => {
	let conan;
	let lambda;

	beforeEach(() => {
		conan = new Conan();
		lambda = new ConanAwsLambda(conan, "AccountCreate");
	});

	it("should return `this` to allow chaining", () => {
		lambda.runtime("nodejs").should.eql(lambda);
	});

	it("should set conanAwsLambda.parameters.runtime to the provided runtime name", () => {

	});
});
