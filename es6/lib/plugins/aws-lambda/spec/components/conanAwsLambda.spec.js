import Conan from "../../../../conan.js";
import ConanAwsLambda from "../../components/conanAwsLambda.js";
import ConanComponent from "../../../../components/conanComponent.js";
import testComponentParameters from "../../../../../spec/helpers/testComponentParameters.js";

describe("ConanAwsLambda(conan, name, filePath, handler)", () => {
	let lambda;
	let conan;
	let name;
	let filePath;
	let handler;

	beforeEach(() => {
		name = "AccountCreate";
		filePath = "/account/create.js";
		handler = "handler";

		conan = new Conan();
		lambda = new ConanAwsLambda(conan, name, filePath, handler);
	});

	it("should extend ConanComponent", () => {
		lambda.should.be.instanceOf(ConanComponent);
	});

	it("should save conan to .conan", () => {
		lambda.conan.should.eql(conan);
	});

	describe("(steps)", () => {
		// TODO: ADD STEPS
	});

	describe("(parameters)", () => {
		testComponentParameters(ConanAwsLambda, [
			"name",
			"filePath",
			"handler",
			"runtime",
			"role",
			"description",
			"memorySize",
			"timeout",
			"publish"
		]);
	});
});
