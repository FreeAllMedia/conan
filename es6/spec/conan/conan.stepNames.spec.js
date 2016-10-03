import Conan from "../../lib/conan.js";

describe("conan.stepGroups", () => {
	let conan;

	function stepOne() {}
	function stepTwo() {}

	beforeEach(() => {
		conan = new Conan();
	});

	it("should return an array containing the name of each step function", () => {
		conan

		.series(
			stepOne,
			stepTwo
		)

		.parallel(
			stepOne,
			stepTwo
		);

		conan.stepNames().should.eql([
			"stepOne",
			"stepTwo",
			"stepOne",
			"stepTwo"
		]);
	});

	it("should return an array containing placeholders for anonymous functions", () => {
		conan

		.series(
			stepOne,
			() => {}
		)

		.parallel(
			stepOne,
			() => {}
		);

		conan.stepNames().should.eql([
			"stepOne",
			"",
			"stepOne",
			""
		]);
	});
});
