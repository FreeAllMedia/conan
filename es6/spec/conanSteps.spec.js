import ConanSteps from "../lib/conanSteps.js";

describe("ConanSteps()", () => {
	it("should not throw an error", () => {
		() => {
			const steps = new ConanSteps();
		}.should.not.throw();
	});
});
