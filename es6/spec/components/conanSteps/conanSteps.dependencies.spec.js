import ConanSteps from "../../../lib/components/conanSteps.js";

describe("conanSteps.dependency(name, value)", () => {
	let conanSteps;

	beforeEach(() => {
		conanSteps = new ConanSteps();
	});

	it("should add dependency to each step's context", testDone => {
		class FakeAWS {}
		conanSteps.dependency("AWS", FakeAWS);
		function stepExample(conan, context, done) {
			context.dependencies.AWS.should.eql(FakeAWS);
			done();
		}
		conanSteps.add(stepExample);
		conanSteps.start(testDone);
	});
});
