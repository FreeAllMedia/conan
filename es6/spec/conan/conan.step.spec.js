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

	it("should return this to enable chaining", () => {
		returnValue.should.eql(conan);
	});

	it("should add a series step to conan with the single provided step", () => {
		conan.stepGroups()[0].should.eql({
			type: "series",
			steps: [step]
		});
	});
});