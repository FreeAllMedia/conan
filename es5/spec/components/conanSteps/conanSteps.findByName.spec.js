import ConanSteps from "../../../lib/components/conanSteps.js";

describe("conanSteps.findByName(stepName)", () => {
	let conanSteps;

	beforeEach(() => {
		conanSteps = new ConanSteps();
	});

	it("should findByName the step function to the collection", () => {
		function stepOne(conan, context, done) {
			done();
		}
		const parameters = {name: "stepName"};
		conanSteps.add(stepOne, parameters);

		conanSteps.findByName("stepOne").should.eql({
			handler: stepOne,
			parameters: parameters
		});
	});
});
