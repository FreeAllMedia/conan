import ConanSteps from "../../lib/conanSteps.js";

describe("conanSteps.add(conanStep)", () => {
	let conanSteps;

	beforeEach(() => {
		conanSteps = new ConanSteps();
	});

	it("should add a step to the collection", () => {
		function conanStep(conan, done) {
			done();
		}
		conanSteps.add(conanStep);
		conanSteps.all[0].should.eql(conanStep);
	});
});
