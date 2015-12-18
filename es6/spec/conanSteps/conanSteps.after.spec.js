import ConanSteps from "../../lib/conanSteps.js";

describe("conanSteps.after(existingStep, afterStep)", () => {
	let conanSteps;

	beforeEach(() => {
		conanSteps = new ConanSteps();
	});

	it("should add a step to the collection after an existing step", () => {
		function conanStepOne(conan, done) {
			done();
		}

		function conanStepTwo(conan, done) {
			done();
		}

		function conanStepThree(conan, done) {
			done();
		}

		conanSteps.add(conanStepOne);
		conanSteps.add(conanStepTwo);

		conanSteps.after(conanStepOne, conanStepThree);

		conanSteps.all[1].should.eql(conanStepThree);
	})
});
