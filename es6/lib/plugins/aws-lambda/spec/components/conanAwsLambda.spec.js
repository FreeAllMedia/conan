import Conan from "../../../../conan.js";
import ConanAwsLambda from "../../components/conanAwsLambda.js";
import ConanComponent from "../../../../components/conanComponent.js";
import inflect from "jargon";

describe("ConanAwsLambda(conan, name, filePath, role)", () => {
	let lambda;
	let name;
	let filePath;
	let role;
	let conan;

	beforeEach(() => {
		name = "AccountCreate";
		filePath = "/account/create.js";
		role = "SomeRole";

		conan = new Conan();
		lambda = new ConanAwsLambda(conan, name, filePath, role);
	});

	it("should extend ConanComponent", () => {
		lambda.should.be.instanceOf(ConanComponent);
	});

	it("should save conan to .conan", () => {
		lambda.conan.should.eql(conan);
	});

	it("should save name to .name()", () => {
		lambda.name().should.eql(name);
	});

	it("should save filePath to .filePath()", () => {
		lambda.filePath().should.eql(filePath);
	});

	it("should save role to .role()", () => {
		lambda.role().should.eql(role);
	});

	describe("(parameters)", () => {
		[
			"name",
			"filePath",
			"role",
			"runtime",
			"description",
			"memorySize",
			"timeout",
			"publish",
			"packages",
			"bucket"
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

	describe("(multiple-value parameters)", () => {
		[
			"handler"
		].forEach((parameterName) => {
			const parameterNamePascalCase = inflect(parameterName).pascal.toString();

			describe(`.${parameterName}(new${parameterNamePascalCase})`, () => {
				it(`should save new${parameterNamePascalCase}`, () => {
					let component = new ConanAwsLambda(conan);
					const testValueOne = "abc123";
					const testValueTwo = "abc123";
					component = component[parameterName](testValueOne, testValueTwo);
					component[parameterName]().should.eql([testValueOne, testValueTwo]);
				});
			});
		});
	});

	describe("(multiple-value-aggregate parameters)", () => {
		[
			"dependencies",
			"alias"
		].forEach((parameterName) => {
			const parameterNamePascalCase = inflect(parameterName).pascal.toString();

			describe(`.${parameterName}(new${parameterNamePascalCase})`, () => {
				it(`should save new${parameterNamePascalCase}`, () => {
					let component = new ConanAwsLambda(conan);

					const testValueOne = "abc123";
					const testValueTwo = "123abc";
					const testValueThree = "1a2b3c";
					const testValueFour = "c1b2a3";

					component = component[parameterName](testValueOne, testValueTwo);
					component = component[parameterName](testValueThree, testValueFour);

					component[parameterName]().should.eql([
						[testValueOne, testValueTwo],
						[testValueThree, testValueFour]
					]);
				});
			});
		});
	});

	describe("(default values)", () => {
		it("should set the handler to 'handler' by default", () => {
			lambda = new ConanAwsLambda(conan, name, filePath);
			lambda.handler().should.eql(["handler"]);
		});
		it("should set the runtime to 'nodejs' by default", () => {
			lambda.runtime().should.eql("nodejs");
		});
		it("should set the memorySize to '128' by default", () => {
			lambda.memorySize().should.eql(128);
		});
		it("should set the timeout to '3' by default", () => {
			lambda.timeout().should.eql(3);
		});
	});

	describe("(steps)", () => {
		it("should add a find lambda by name step", () => {
			const step = conan.steps.findByName("findLambdaByNameStep");
			step.parameters.should.eql(lambda);
		});

		it("should add a find role by name step", () => {
			const step = conan.steps.findByName("findRoleByNameStep");
			step.parameters.should.eql(lambda);
		});

		it("should add a create role step", () => {
			const step = conan.steps.findByName("createRoleStep");
			step.parameters.should.eql(lambda);
		});

		it("should add a attach role policy step", () => {
			const step = conan.steps.findByName("attachRolePolicyStep");
			step.parameters.should.eql(lambda);
		});

		it("should add a compile packages step", () => {
			const step = conan.steps.findByName("buildPackageStep");
			step.parameters.should.eql(lambda);
		});

		it("should add compile lambda zip step", () => {
			const step = conan.steps.findByName("compileLambdaZipStep");
			step.parameters.should.eql(lambda);
		});

		it("should add an upsert lambda step", () => {
			const step = conan.steps.findByName("upsertLambdaStep");
			step.parameters.should.eql(lambda);
		});

		it("should add an publish lambda version step", () => {
			const step = conan.steps.findByName("publishLambdaVersionStep");
			step.parameters.should.eql(lambda);
		});

		it("should add an find lambda alias step", () => {
			const step = conan.steps.findByName("findLambdaAliasStep");
			step.parameters.should.eql(lambda);
		});
	});

	describe(".lambda(name)", () => {
		beforeEach(() => {
			name = "MyLambda";

			lambda = lambda.lambda(name);
		});

		it("should return an instance of ConanAwsLambda", () => {
			lambda.should.be.instanceOf(ConanAwsLambda);
		});

		it("should pass conan to the ConanAwsLambda constructor", () => {
			lambda.conan.should.eql(conan);
		});

		it("should pass the lambda name to the ConanAwsLambda constructor", () => {
			lambda.name().should.eql(name);
		});
	});
});
