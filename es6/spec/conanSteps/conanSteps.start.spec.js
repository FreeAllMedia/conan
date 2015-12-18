import ConanSteps from "../../lib/conanSteps.js";
import sinon from "sinon";

describe("conanSteps.start(callback)", () => {
	let conanSteps;

	beforeEach(() => {
		conanSteps = new ConanSteps();
	});

	it("should run all step functions in order", done => {
		const conanStepFunction = (conan, doneStep) => doneStep();

		const conanStepOne = sinon.spy(conanStepFunction);
		const conanStepTwo = sinon.spy(conanStepFunction);

		conanSteps.add(conanStepOne);
		conanSteps.add(conanStepTwo);

		conanSteps.start((error) => {
			sinon.assert.callOrder(conanStepOne, conanStepTwo);
			done(error);
		});
	});
});
