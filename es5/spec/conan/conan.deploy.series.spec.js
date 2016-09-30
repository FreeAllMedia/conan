import Conan from "../../lib/conan.js";
import sinon from "sinon";

describe("conan.deploy(callback) (series)", () => {
	let conan,
			stepOne,
			stepTwo;

	beforeEach(done => {
		conan = new Conan();
		const conanStepFunction = (stepConan, stepDone) => stepDone();

		stepOne = sinon.spy(conanStepFunction);
		stepTwo = sinon.spy(conanStepFunction);

		conan
		.series(
			stepOne,
			stepTwo
		);

		conan.deploy(done);
	});

	it("should run all step functions in serial order", () => {
		sinon.assert.callOrder(stepOne, stepTwo);
	});
});
