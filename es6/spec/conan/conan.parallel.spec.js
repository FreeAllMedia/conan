import Conan from "../../lib/conan.js";

describe("conan.parallel(...steps)", () => {
	let conan,
			stepOne,
			stepTwo,
			returnValue;

	beforeEach(() => {
		conan = new Conan();

		stepOne = function () {};
		stepTwo = function () {};

		returnValue = conan.parallel(
			stepOne,
			stepTwo
		);
	});

	it("should return conan to enable chaining", () => {
		returnValue.should.eql(conan);
	});

	it("should add a parallel step to conan", () => {
		conan.steps[0].should.eql({
			concurrency: "parallel",
			steps: [stepOne, stepTwo]
		});
	});
});
