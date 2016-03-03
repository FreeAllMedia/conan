/* eslint-disable no-unused-vars */
import ConanSteps from "../../lib/components/conanSteps.js";

describe("ConanSteps(parent)", () => {
	it("should not throw an error", () => {
		(() => {
			const conan = {};
			const steps = new ConanSteps(conan);
		}).should.not.throw();
	});

	it("should save parent to .parent", () => {
		const conan = {};
		const steps = new ConanSteps(conan);
		steps.parent.should.eql(conan);
	});
});
