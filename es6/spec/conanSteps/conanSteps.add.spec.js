import ConanSteps from "../../lib/conanSteps.js";

describe("conanSteps.add(conanStep)", () => {
	let conanSteps;

	beforeEach(() => {
		conanSteps = new ConanSteps();
	});

	it("should add the step function to the collection", () => {
		function conanStep(conan, context, done) {
			done();
		}
		const parameters = {name: "stepName"};
		conanSteps.add(conanStep, parameters);
		conanSteps.all[0].should.eql({handler: conanStep, parameters: parameters});
	});
});
