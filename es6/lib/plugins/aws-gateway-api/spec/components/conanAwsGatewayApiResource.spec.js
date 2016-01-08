import Conan from "../../../../conan.js";
import ConanAwsGatewayApiResource from "../../components/conanAwsGatewayApiResource.js";
import findApiStageByNameStep from "../../steps/findApiStageByNameStep.js";
import findLambdaByNameStep from "../../../aws-lambda/steps/findLambdaByNameStep.js";
import ConanComponent from "../../../../components/conanComponent.js";
import inflect from "jargon";

describe("ConanAwsGatewayApiResource(conan)", () => {
	let apiResource;
	let path;
	let method;
	let conan;

	beforeEach(() => {
		path = "/account";
		method = "GET";

		conan = new Conan();
		apiResource = new ConanAwsGatewayApiResource(conan, path, method);
	});

	it("should extend ConanComponent", () => {
		apiResource.should.be.instanceOf(ConanComponent);
	});

	it("should save conan to .conan", () => {
		apiResource.conan.should.eql(conan);
	});

	describe("(parameters)", () => {
		[
			"path",
			"method",
			"lambda",
			"statusCodes"
		].forEach((parameterName) => {
			const parameterNamePascalCase = inflect(parameterName).pascal.toString();

			describe(`.${parameterName}(new${parameterNamePascalCase})`, () => {
				it(`should save new${parameterNamePascalCase}`, () => {
					let component = new ConanAwsGatewayApiResource(conan);
					const testValue = "abc123";
					component = component[parameterName](testValue);
					component[parameterName]().should.eql(testValue);
				});
			});
		});
	});

	describe("(steps)", () => {
		describe("(step order)", () => {
			beforeEach(() => {
				conan = new Conan();
				conan.steps.add(findApiStageByNameStep, {});
				apiResource = new ConanAwsGatewayApiResource(conan, path, method);
			});

			it("should insert all his steps before the find stage component step", () => {
				conan.steps.all.pop().handler.should.equal(findApiStageByNameStep);
			});

			it("should insert the find lambda step at first", () => {
				conan.steps.all.shift().handler.should.equal(findLambdaByNameStep);
			});
		});

		it("should add a find apiResource by name step", () => {
			const step = conan.steps.findByName("findApiResourceByPathStep");
			step.parameters.should.eql(apiResource);
		});

		it("should add a create api resources step", () => {
			const step = conan.steps.findByName("createApiResourcesStep");
			step.parameters.should.eql(apiResource);
		});

		it("should add a find resource method step", () => {
			const step = conan.steps.findByName("findResourceMethodStep");
			step.parameters.should.eql(apiResource);
		});

		it("should add a create resource method step", () => {
			const step = conan.steps.findByName("createResourceMethodStep");
			step.parameters.should.eql(apiResource);
		});

		it("should add a find lambda by name step", () => {
			const step = conan.steps.findByName("findLambdaByNameStep");
			step.parameters.should.eql(apiResource);
		});

		it("should add a put integration step", () => {
			const step = conan.steps.findByName("putIntegrationStep");
			step.parameters.should.eql(apiResource);
		});

		it("should add a put integration response step", () => {
			const step = conan.steps.findByName("putIntegrationResponseStep");
			step.parameters.should.eql(apiResource);
		});

		it("should add a put method response step", () => {
			const step = conan.steps.findByName("findMethodResponseStep");
			step.parameters.should.eql(apiResource);
		});

		it("should add a put method response step", () => {
			const step = conan.steps.findByName("putMethodResponseStep");
			step.parameters.should.eql(apiResource);
		});
	});

	[
		"GET",
		"POST",
		"PUT",
		"DELETE"
	].forEach((resourceMethod) => {
		const methodFunctionName = resourceMethod.toLowerCase();
		describe(`apiResource.${methodFunctionName}(path)`, () => {
			let newResource;
			beforeEach(() => {
				path = "/testResource";
				method = resourceMethod;

				newResource = ConanAwsGatewayApiResource.prototype[methodFunctionName].call(apiResource, path);
			});

			it("should return an instance of ConanAwsGatewayApiResource", () => {
				newResource.should.be.instanceOf(ConanAwsGatewayApiResource);
			});

			it("should pass conan to the ConanAwsGatewayApiResource constructor", () => {
				newResource.conan.should.eql(conan);
			});

			it("should pass the path to the ConanAwsGatewayApiResource constructor", () => {
				newResource.path().should.eql(path);
			});

			it("should pass the method to the ConanAwsGatewayApiResource constructor", () => {
				newResource.method().should.eql(method);
			});
		});
	});
});
