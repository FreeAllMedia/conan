import Conan from "../../../../conan.js";
import ConanAwsApiGateway from "../../components/conanAwsApiGateway.js";
import ConanAwsApiGatewayStage from "../../components/conanAwsApiGatewayStage.js";
import ConanComponent from "../../../../components/conanComponent.js";
import inflect from "jargon";

describe("ConanAwsApiGateway(conan, name)", () => {
	let api;
	let name;
	let conan;

	beforeEach(() => {
		name = "MyAPI";

		conan = new Conan();
		api = new ConanAwsApiGateway(conan, name);
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
					let component = new ConanAwsApiGateway(conan);
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

		it("should return an instance of ConanAwsApiGatewayStage", () => {
			stage.should.be.instanceOf(ConanAwsApiGatewayStage);
		});

		it("should pass conan to the ConanAwsApiGatewayStage constructor", () => {
			stage.conan.should.eql(conan);
		});

		it("should pass the stage name to the ConanAwsApiGateway constructor", () => {
			stage.name().should.eql(name);
		});
	});

	describe("api.api(name)", () => {
		beforeEach(() => {
			name = "MyAPI";

			api = api.api(name);
		});

		it("should return an instance of ConanAwsApiGateway", () => {
			api.should.be.instanceOf(ConanAwsApiGateway);
		});

		it("should pass conan to the ConanAwsApiGateway constructor", () => {
			api.conan.should.eql(conan);
		});

		it("should pass the api name to the ConanAwsApiGateway constructor", () => {
			api.name().should.eql(name);
		});
	});
});
