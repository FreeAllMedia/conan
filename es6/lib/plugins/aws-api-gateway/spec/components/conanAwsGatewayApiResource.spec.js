import Conan from "../../../../conan.js";
import ConanAwsApiGatewayResource from "../../components/conanAwsApiGatewayResource.js";
import findApiStageByNameStep from "../../steps/findApiStageByNameStep.js";
import findLambdaByNameStep from "../../../aws-lambda/steps/findLambdaByNameStep.js";
import ConanComponent from "../../../../components/conanComponent.js";
import inflect from "jargon";

describe("ConanAwsApiGatewayResource(conan)", () => {
	let apiResource;
	let path;
	let method;
	let conan;

	beforeEach(() => {
		path = "/account";
		method = "GET";

		conan = new Conan();
		apiResource = new ConanAwsApiGatewayResource(conan, path, method);
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
			"statusCodes",
			"responseHeaders"
		].forEach((parameterName) => {
			const parameterNamePascalCase = inflect(parameterName).pascal.toString();

			describe(`.${parameterName}(new${parameterNamePascalCase})`, () => {
				it(`should save new${parameterNamePascalCase}`, () => {
					let component = new ConanAwsApiGatewayResource(conan);
					const testValue = "abc123";
					component = component[parameterName](testValue);
					component[parameterName]().should.eql(testValue);
				});
			});
		});
	});

	describe("(multiple-value parameters)", () => {
		[
			"headers",
			"queryStrings"
		].forEach((parameterName) => {
			const parameterNamePascalCase = inflect(parameterName).pascal.toString();

			describe(`.${parameterName}(new${parameterNamePascalCase})`, () => {
				it(`should save new${parameterNamePascalCase}`, () => {
					let component = new ConanAwsApiGatewayResource(conan);
					const testValueOne = "abc123";
					const testValueTwo = "abc123";
					component = component[parameterName](testValueOne, testValueTwo);
					component[parameterName]().should.eql([testValueOne, testValueTwo]);
				});
			});
		});
	});

	describe("(steps)", () => {
		describe("(step order)", () => {
			beforeEach(() => {
				conan = new Conan();
				conan.steps.add(findApiStageByNameStep, {});
				apiResource = new ConanAwsApiGatewayResource(conan, path, method);
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

		it("should add a find method response step", () => {
			const step = conan.steps.findByName("findMethodResponseStep");
			step.parameters.should.eql(apiResource);
		});

		it("should add a put method response step", () => {
			const step = conan.steps.findByName("putMethodResponseStep");
			step.parameters.should.eql(apiResource);
		});

		it("should add a add permission step", () => {
			const step = conan.steps.findByName("addPermissionStep");
			step.parameters.should.eql(apiResource);
		});

		it("should add a get account id step", () => {
			const step = conan.steps.findByName("getAccountIdStep");
			step.parameters.should.eql(apiResource);
		});
	});

	[
		"GET",
		"POST",
		"PUT",
		"DELETE",
		"OPTIONS"
	].forEach((resourceMethod) => {
		const methodFunctionName = resourceMethod.toLowerCase();
		describe(`apiResource.${methodFunctionName}(path)`, () => {
			let newResource;
			beforeEach(() => {
				path = "/testResource";
				method = resourceMethod;

				newResource = ConanAwsApiGatewayResource.prototype[methodFunctionName].call(apiResource, path);
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
