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

		conanSteps.add(conanStepOne);
		conanSteps.before(conanStepOne, conanStepTwo);

		conanSteps.all[0].should.eql(conanStepTwo);
	})
});
