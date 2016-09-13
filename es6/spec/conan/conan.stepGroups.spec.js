import Conan from "../../lib/conan.js";

describe("conan.stepGroups", () => {
	let conan,
			stepOne,
			stepTwo;

	beforeEach(() => {
		conan = new Conan();

		stepOne = function () {};
		stepTwo = function () {};

		conan
		.series(
			stepOne,
			stepTwo
		)
		.parallel(
			stepOne,
			stepTwo
		);
	});

	it("should contain a step for each step group", () => {
		conan.stepGroups().length.should.eql(2);
	});
});
