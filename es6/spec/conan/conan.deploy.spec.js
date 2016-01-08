import Conan from "../../lib/conan.js";
import sinon from "sinon";

describe("conan.deploy(callback)", () => {
	let conan;

	beforeEach(() => {
		conan = new Conan();
	});

	it("should run all step functions in order", done => {
		const conanStepFunction = (stepConan, context, stepDone) => stepDone();

		const conanStepOne = sinon.spy(conanStepFunction);
		const conanStepTwo = sinon.spy(conanStepFunction);

		conan.steps.add(conanStepOne);
		conan.steps.add(conanStepTwo);

		conan.deploy((error) => {
			sinon.assert.callOrder(conanStepOne, conanStepTwo);
			done(error);
		});
	});
});
