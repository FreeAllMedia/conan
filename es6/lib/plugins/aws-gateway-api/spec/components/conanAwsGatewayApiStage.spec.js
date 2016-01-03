import Conan from "../../../../conan.js";
import ConanAwsGatewayApi from "../../components/conanAwsGatewayApi.js";
import ConanAwsGatewayApiStage from "../../components/conanAwsGatewayApiStage.js";
import ConanComponent from "../../../../components/conanComponent.js";
import inflect from "jargon";

describe("ConanAwsGatewayApiStage(conan, name)", () => {
	let api;
	let stage;
	let name;
	let conan;

	beforeEach(() => {
		name = "MyAPI";

		conan = new Conan();
		api = new ConanAwsGatewayApi(conan, "SomeApi");
		stage = new ConanAwsGatewayApiStage(api, name);
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
					let component = new ConanAwsGatewayApiStage(conan);
					const testValue = "abc123";
					component = component[parameterName](testValue);
					component[parameterName]().should.eql(testValue);
				});
			});
		});
	});

	// describe("(steps)", () => {
	// 	it("should add a find api by name step", () => {
	// 		const step = conan.steps.findByName("findLambdaByNameStep");
	// 		step.parameters.should.eql(api);
	// 	});
	// });
});
