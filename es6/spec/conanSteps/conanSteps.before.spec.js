import ConanSteps from "../../lib/conanSteps.js";

describe("conanSteps.before(existingStep, beforeStep)", () => {
	let conanSteps;

	beforeEach(() => {
		conanSteps = new ConanSteps();
	});

	it("should add a step to the collection before an existing step", () => {
		function conanStepOne(conan, done) {
			done();
		}

		function conanStepTwo(conan, done) {
			done();
		}

		function conanStepThree(conan, done) {
			done();
		}

		const stepOneParameters = {foo: "bar"};
		conanSteps.add(conanStepOne, stepOneParameters);

		const stepTwoParameters = {baz: "squee"};
		conanSteps.add(conanStepTwo, stepTwoParameters);

		const stepThreeParameters = {blah: "bing"};
		conanSteps.before(conanStepTwo, conanStepThree, stepThreeParameters);

		conanSteps.all[1].should.eql({
			handler: conanStepThree, parameters: stepThreeParameters
		});
	});
});
