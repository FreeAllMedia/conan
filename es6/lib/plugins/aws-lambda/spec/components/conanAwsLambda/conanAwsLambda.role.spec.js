import Conan from "../../../../../conan.js";
import ConanAwsLambda from "../../../components/conanAwsLambda.js";

describe("conanAwsLambda.role(name)", () => {
	let conan;
	let lambda;

	beforeEach(() => {
		conan = new Conan();
		lambda = new ConanAwsLambda(conan, "AccountCreate");
	});

	it("should return `this` to allow chaining", () => {
		lambda.role("roleName").should.eql(lambda);
	});

	it("should set conanAwsLambda.parameters.role to the provided role name", () => {
		lambda.role("roleName").parameters.role.should.equal("roleName");
	});
});
