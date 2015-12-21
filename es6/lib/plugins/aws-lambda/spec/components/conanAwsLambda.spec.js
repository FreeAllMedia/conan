import Conan from "../../../../conan.js";
import ConanAwsLambda from "../../components/conanAwsLambda.js";
import ConanComponent from "../../../../components/conanComponent.js";

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

	it("should save conan to .parameters.conan", () => {
		lambda.conan.should.eql(conan);
	});

	it("should save name to .parameters.name", () => {
		lambda.parameters.name.should.eql(name);
	});

	it("should save filePath to .parameters.filePath", () => {
		lambda.parameters.filePath.should.eql(filePath);
	});

	it("should save handler to .parameters.handler", () => {
		lambda.parameters.handler.should.eql(handler);
	});
});
