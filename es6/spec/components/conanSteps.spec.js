/* eslint-disable no-unused-vars */
import ConanSteps from "../../lib/components/conanSteps.js";

describe("ConanSteps()", () => {
	it("should not throw an error", () => {
		() => {
			const steps = new ConanSteps();
		}.should.not.throw();
	});
});
