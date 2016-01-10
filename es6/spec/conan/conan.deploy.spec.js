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

	it("should return step errors", done => {
		const conanStepError = new Error("Some error happened!");

		const conanStepWithErrorFunction = (stepConan, context, stepDone) => {
			stepDone(conanStepError);
		};

		const conanStepOne = sinon.spy(conanStepWithErrorFunction);
		const conanStepTwo = sinon.spy();

		conan.steps.add(conanStepOne);
		conan.steps.add(conanStepTwo);

		conan.deploy((error) => {
			error.should.eql(conanStepError);
			done();
		});
	});

	it("should halt step execution if an error is returned", done => {
		const conanStepError = new Error("Some error happened!");

		const conanStepWithError = (stepConan, context, stepDone) => {
			stepDone(conanStepError);
		};

		const conanStepOne = sinon.spy(conanStepWithError);
		const conanStepTwo = sinon.spy();

		conan.steps.add(conanStepOne);
		conan.steps.add(conanStepTwo);

		conan.deploy(() => {
			conanStepTwo.called.should.be.false;
			done();
		});
	});
});
