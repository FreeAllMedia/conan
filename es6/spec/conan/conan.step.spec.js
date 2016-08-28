import Conan from "../../lib/conan.js";

describe("conan.series(...steps)", () => {
	let conan,
			step,
			returnValue;

	beforeEach(() => {
		conan = new Conan();

		step = function () {};

		returnValue = conan.step(step);
	});

	it("should return conan to enable chaining", () => {
		returnValue.should.eql(conan);
	});

	it("should add a series step to conan with the single provided step", () => {
		conan.steps[0].should.eql({
			concurrency: "series",
			steps: [step]
		});
	});
});
