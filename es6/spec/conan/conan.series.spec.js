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

	it("should return a StepGroupSetter", () => {
		returnValue.constructor.name.should.eql("StepGroupSetter");
	});

	it("should set the stepGroup to a `series` type", () => {
		returnValue.stepGroup.type.should.eql("series");
	});

	it("should add a series step to conan", () => {
		conan.stepGroups()[0].should.eql({
			type: "series",
			steps: [stepOne, stepTwo]
		});
	});
});
