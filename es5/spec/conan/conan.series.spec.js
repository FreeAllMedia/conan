import Conan from "../../lib/conan.js";

describe("conan.series(...steps)", () => {
	let conan,
			stepOne,
			stepTwo,
			returnValue;

	beforeEach(() => {
		conan = new Conan();

		stepOne = function () {};
		stepTwo = function () {};

		returnValue = conan.series(
			stepOne,
			stepTwo
		);
	});

	it("should return conan to enable chaining", () => {
		returnValue.should.eql(conan);
	});

	it("should add a series step to conan", () => {
		conan.steps[0].should.eql({
			concurrency: "series",
			steps: [stepOne, stepTwo]
		});
	});
});
