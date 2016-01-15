import Conan from "../../../../conan.js";
import ConanAwsApiGateway from "../../components/conanAwsApiGateway.js";
import ConanAwsApiGatewayStage from "../../components/conanAwsApiGatewayStage.js";
import ConanAwsApiGatewayResource from "../../components/conanAwsApiGatewayResource.js";
import ConanComponent from "../../../../components/conanComponent.js";
import inflect from "jargon";

describe("ConanAwsApiGatewayStage(conan, name)", () => {
	let stage;
	let name;
	let conan;

	beforeEach(() => {
		name = "MyAPI";

		conan = new Conan();
		stage = new ConanAwsApiGatewayStage(conan, name);
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
					let component = new ConanAwsApiGatewayStage(conan);
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

		it("should return an instance of ConanAwsApiGateway", () => {
			newApi.should.be.instanceOf(ConanAwsApiGateway);
		});

		it("should pass conan to the ConanAwsApiGateway constructor", () => {
			newApi.conan.should.eql(conan);
		});

		it("should pass the api name to the ConanAwsApiGateway constructor", () => {
			newApi.name().should.eql(name);
		});
	});

	[
		"GET",
		"POST",
		"PUT",
		"DELETE"
	].forEach((resourceMethod) => {
		const methodFunctionName = resourceMethod.toLowerCase();
		describe(`stage.${methodFunctionName}(path)`, () => {
			let newResource;
			let path;
			let method;

			beforeEach(() => {
				path = "/testResource";
				method = resourceMethod;

				newResource = ConanAwsApiGatewayStage.prototype[methodFunctionName].call(stage, path);
			});

			it("should return an instance of ConanAwsApiGatewayResource", () => {
				newResource.should.be.instanceOf(ConanAwsApiGatewayResource);
			});

			it("should pass conan to the ConanAwsApiGatewayResource constructor", () => {
				newResource.conan.should.eql(conan);
			});

			it("should pass the path to the ConanAwsApiGatewayResource constructor", () => {
				newResource.path().should.eql(path);
			});

			it("should pass the method to the ConanAwsApiGatewayResource constructor", () => {
				newResource.method().should.eql(method);
			});
		});
	});
});
