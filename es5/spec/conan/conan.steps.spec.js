import Conan from "../../lib/conan.js";
import ConanSteps from "../../lib/components/conanSteps.js";

describe("conan.steps", () => {
	it("should return an instance of ConanSteps", () => {
		const conan = new Conan();
		conan.steps.should.be.instanceOf(ConanSteps);
	});
});
