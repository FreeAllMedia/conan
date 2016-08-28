import Conan from "../../lib/conan.js";
import sinon from "sinon";

describe("conan.deploy(callback) (parallel)", () => {
	let conan,
			stepOne,
			stepTwo,
			clock;

	beforeEach(() => {
		clock = sinon.useFakeTimers(Date.now());

		conan = new Conan();

		const conanStepFunction = (deployer, stepDone) => {
			setTimeout(stepDone, 100);
		};
		stepOne = sinon.spy(conanStepFunction);
		stepTwo = sinon.spy(conanStepFunction);

		conan
		.parallel(
			stepOne,
			stepTwo
		)
		.deploy();
	});

	afterEach(() => clock.restore());

	it("should run all step functions", () => {
		clock.tick(50);

		const actualResults = {
			stepOneCalled: stepOne.called,
			stepTwoCalled: stepTwo.called
		};

		const expectedResults = {
			stepOneCalled: true,
			stepTwoCalled: true
		};

		actualResults.should.eql(expectedResults);
	});
});
