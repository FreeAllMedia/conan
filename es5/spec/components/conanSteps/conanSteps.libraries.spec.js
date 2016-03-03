import ConanSteps from "../../../lib/components/conanSteps.js";

describe("conanSteps.library(name, value)", () => {
	let conanSteps;

	beforeEach(() => {
		conanSteps = new ConanSteps();
	});

	it("should add library to .libraries", () => {
		class FakeAWS {}
		conanSteps.library("AWS", FakeAWS);
		conanSteps.libraries.AWS.should.eql(FakeAWS);
	});

	it("should add library to each step's context", testDone => {
		class FakeAWS {}
		conanSteps.library("AWS", FakeAWS);
		function stepExample(conan, context, done) {
			context.libraries.AWS.should.eql(FakeAWS);
			done();
		}
		conanSteps.add(stepExample);
		conanSteps.start(testDone);
	});
});
