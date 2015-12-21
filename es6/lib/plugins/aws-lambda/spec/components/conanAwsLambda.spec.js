import Conan from "../../../../conan.js";
import ConanAwsLambda from "../../components/conanAwsLambda.js";
import ConanComponent from "../../../../components/conanComponent.js";

describe("ConanAwsLambda(conan, name, path, handler)", () => {
	let lambda;

	let conan;
	let name;
	let path;
	let handler;

	beforeEach(() => {
		name = "AccountCreate";
		path = "/account/create";
		handler = "handler";

		conan = new Conan();
		lambda = new ConanAwsLambda(conan, name, path, handler);
	});

	it("should extend ConanComponent", () => {
		lambda.should.be.instanceOf(ConanComponent);
	});

	it("should save conan to .parameters.conan", () => {
		lambda.parameters.conan.should.eql(conan);
	});

	it("should save name to .parameters.name", () => {
		lambda.parameters.name.should.eql(name);
	});

	it("should save path to .parameters.path", () => {
		lambda.parameters.path.should.eql(path);
	});

	it("should save handler to .parameters.handler", () => {
		lambda.parameters.handler.should.eql(handler);
	});
});
