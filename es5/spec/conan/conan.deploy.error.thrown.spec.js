import Conan from "../../lib/conan.js";
import sinon from "sinon";

describe("conan.deploy(callback) (thrown error)", () => {
	let conan,
			actualError,
			expectedError,
			stepOne,
			stepTwo;

	beforeEach(done => {
		conan = new Conan();

		expectedError = new Error("Some error happened!");

		const conanStepWithErrorFunction = (stepConan, stepDone) => {
			stepDone(expectedError);
		};

		stepOne = sinon.spy(conanStepWithErrorFunction);
		stepTwo = sinon.spy();

		conan.series(
			stepOne,
			stepTwo
		);

		conan.deploy(error => {
			actualError = error;
			done();
		});
	});

	it("should return step errors", () => {
		actualError.should.eql(expectedError);
	});

	it("should halt step execution if an error is returned", () => {
		stepTwo.called.should.be.false;
	});
});
