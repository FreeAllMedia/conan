import ConanSteps from "../../lib/conanSteps.js";
import Conan from "../../lib/conan.js";

import sinon from "sinon";

describe("conanSteps.start(callback)", () => {
	let conan,
			conanSteps,
			conanStepOne,
			conanStepTwo;

	beforeEach(() => {
		conan = new Conan();
		conanSteps = new ConanSteps(conan);
		const conanStepFunction = (conan, context, stepDone) => stepDone();

		conanStepOne = sinon.spy(conanStepFunction);
		conanStepTwo = sinon.spy(conanStepFunction);
		conanSteps.add(conanStepOne);
		conanSteps.add(conanStepTwo);
	});

	it("should run all step functions in order", done => {
		conanSteps.start((error) => {
			sinon.assert.callOrder(conanStepOne, conanStepTwo);
			done(error);
		});
	});

	it("should pass conan as the first argument to each step", done => {
		conanSteps.start((error) => {
			conanStepOne.firstCall.args[0].should.eql(conan);
			done(error);
		});
	});

	it("should pass the api context as the second argument to each step");
	it("should pass step callback as the last argument to each step");

	it("should aggregate context changes across steps");
});
