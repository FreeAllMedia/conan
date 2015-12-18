import ConanSteps from "../../lib/conanSteps.js";

describe("conanSteps.all", () => {
	let conanSteps;

	beforeEach(() => {
		conanSteps = new ConanSteps();
	});

	it("should default to an empty array", () => {
		conanSteps.all.should.eql([]);
	});

	it("should return all steps", () => {
		function conanStep(conan, done) {
			done();
		}
		conanSteps.add(conanStep);
		conanSteps.all.should.eql([conanStep]);
	});
});
