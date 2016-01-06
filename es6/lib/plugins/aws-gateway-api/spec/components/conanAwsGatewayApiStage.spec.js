import Conan from "../../../../conan.js";
import ConanAwsGatewayApi from "../../components/conanAwsGatewayApi.js";
import ConanAwsGatewayApiStage from "../../components/conanAwsGatewayApiStage.js";
import ConanComponent from "../../../../components/conanComponent.js";
import inflect from "jargon";

describe("ConanAwsGatewayApiStage(conan, name)", () => {
	let stage;
	let name;
	let conan;

	beforeEach(() => {
		name = "MyAPI";

		conan = new Conan();
		stage = new ConanAwsGatewayApiStage(conan, name);
	});

	it("should extend ConanComponent", () => {
		stage.should.be.instanceOf(ConanComponent);
	});

	it("should save conant to stage.conan", () => {
		stage.conan.should.eql(conan);
	});

	describe("(parameters)", () => {
		[
			"name",
			"description"
		].forEach((parameterName) => {
			const parameterNamePascalCase = inflect(parameterName).pascal.toString();

			describe(`.${parameterName}(new${parameterNamePascalCase})`, () => {
				it(`should save new${parameterNamePascalCase}`, () => {
					let component = new ConanAwsGatewayApiStage(conan);
					const testValue = "abc123";
					component = component[parameterName](testValue);
					component[parameterName]().should.eql(testValue);
				});
			});
		});
	});

	describe("(steps)", () => {
		it("should add a find api by name step", () => {
			const step = conan.steps.findByName("findApiStageByNameStep");
			step.parameters.should.eql(stage);
		});

		it("should add a create stage step", () => {
			const step = conan.steps.findByName("createApiStageStep");
			step.parameters.should.eql(stage);
		});

		it("should add a update stage step", () => {
			const step = conan.steps.findByName("updateApiStageStep");
			step.parameters.should.eql(stage);
		});
	});

	describe("stage.api(name)", () => {
		let newApi;

		beforeEach(() => {
			name = "MyAPI";

			newApi = stage.api(name);
		});

		it("should return an instance of ConanAwsGatewayApi", () => {
			newApi.should.be.instanceOf(ConanAwsGatewayApi);
		});

		it("should pass conan to the ConanAwsGatewayApi constructor", () => {
			newApi.conan.should.eql(conan);
		});

		it("should pass the api name to the ConanAwsGatewayApi constructor", () => {
			newApi.name().should.eql(name);
		});
	});
});
