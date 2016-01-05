import Conan from "../../../../conan.js";
import ConanAwsGatewayApi from "../../components/conanAwsGatewayApi.js";
import ConanAwsGatewayApiStage from "../../components/conanAwsGatewayApiStage.js";
import ConanComponent from "../../../../components/conanComponent.js";
import inflect from "jargon";

describe("ConanAwsGatewayApi(conan, name)", () => {
	let api;
	let name;
	let conan;

	beforeEach(() => {
		name = "MyAPI";

		conan = new Conan();
		api = new ConanAwsGatewayApi(conan, name);
	});

	it("should extend ConanComponent", () => {
		api.should.be.instanceOf(ConanComponent);
	});

	it("should save conan to .conan", () => {
		api.conan.should.eql(conan);
	});

	describe("(parameters)", () => {
		[
			"name"
		].forEach((parameterName) => {
			const parameterNamePascalCase = inflect(parameterName).pascal.toString();

			describe(`.${parameterName}(new${parameterNamePascalCase})`, () => {
				it(`should save new${parameterNamePascalCase}`, () => {
					let component = new ConanAwsGatewayApi(conan);
					const testValue = "abc123";
					component = component[parameterName](testValue);
					component[parameterName]().should.eql(testValue);
				});
			});
		});
	});

	describe("(steps)", () => {
		it("should add a find api by name step", () => {
			const step = conan.steps.findByName("findApiByNameStep");
			step.parameters.should.eql(api);
		});

		it("should add a update api step", () => {
			const step = conan.steps.findByName("updateApiStep");
			step.parameters.should.eql(api);
		});

		it("should add a create api step", () => {
			const step = conan.steps.findByName("createApiStep");
			step.parameters.should.eql(api);
		});
	});

	describe("api.stage(name)", () => {
		let stage;

		beforeEach(() => {
			name = "MyStage";

			stage = api.stage(name);
		});

		it("should return an instance of ConanAwsGatewayApiStage", () => {
			stage.should.be.instanceOf(ConanAwsGatewayApiStage);
		});

		it("should pass conan to the ConanAwsGatewayApiStage constructor", () => {
			stage.conan.should.eql(conan);
		});

		it("should pass the stage name to the ConanAwsGatewayApi constructor", () => {
			stage.name().should.eql(name);
		});
	});

	describe("api.api(name)", () => {
		beforeEach(() => {
			name = "MyAPI";

			api = api.api(name);
		});

		it("should return an instance of ConanAwsGatewayApi", () => {
			api.should.be.instanceOf(ConanAwsGatewayApi);
		});

		it("should pass conan to the ConanAwsGatewayApi constructor", () => {
			api.conan.should.eql(conan);
		});

		it("should pass the api name to the ConanAwsGatewayApi constructor", () => {
			api.name().should.eql(name);
		});
	});
});
