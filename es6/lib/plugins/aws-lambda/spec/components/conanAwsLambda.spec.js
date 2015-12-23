import Conan from "../../../../conan.js";
import ConanAwsLambda from "../../components/conanAwsLambda.js";
import ConanComponent from "../../../../components/conanComponent.js";
import inflect from "jargon";

describe("ConanAwsLambda(conan, name, filePath, handler)", () => {
	let lambda;
	let name;
	let filePath;
	let handler;
	let conan;

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

	describe("(parameters)", () => {
		[
			"name",
			"filePath",
			"handler",
			"runtime",
			"role",
			"description",
			"memorySize",
			"timeout",
			"publish"
		].forEach((parameterName) => {
			const parameterNamePascalCase = inflect(parameterName).pascal.toString();

			describe(`.${parameterName}(new${parameterNamePascalCase})`, function describeComponentParameter() {
				it(`should save new${parameterNamePascalCase}`, function itShouldSaveComponentParameter() {
					let component = new ConanAwsLambda(conan);
					const testValue = "abc123";
					component = component[parameterName](testValue);
					component[parameterName]().should.eql(testValue);
				});
			});
		});
	});

	describe("(steps)", () => {
		it("should add the steps to conan to deploy the lambda afterwards", () => {
			const stepNames = conan.steps.all.map(step => {
				return step.handler.name;
			});
			stepNames.should.eql([
				"compileDependenciesStep",
				"findLambdaByNameStep",
				"upsertLambdaByNameStep"
			]);
		});
	});
});
