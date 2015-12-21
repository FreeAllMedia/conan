import Conan from "../../../../../conan.js";
import ConanAwsLambda from "../../../components/conanAwsLambda.js";

describe("conanAwsLambda.description(name)", () => {
	let conan;
	let lambda;

	beforeEach(() => {
		conan = new Conan();
		lambda = new ConanAwsLambda(conan, "AccountCreate");
	});

	it("should return `this` to allow chaining", () => {
		lambda.description("this is a test lambda").should.eql(lambda);
	});

	it("should set conanAwsLambda.parameters.description to the provided description name", () => {
		lambda.description("this is a test lambda").parameters.description.should.equal("this is a test lambda");
	});
});
