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

	it("should return a StepGroupSetter", () => {
		returnValue.constructor.name.should.eql("StepGroupSetter");
	});

	it("should set the stepGroup to a `parallel` type", () => {
		returnValue.stepGroup.type.should.eql("parallel");
	});

	it("should add a parallel step to conan", () => {
		conan.stepGroups()[0].should.eql({
			type: "parallel",
			steps: [stepOne, stepTwo]
		});
	});
});
