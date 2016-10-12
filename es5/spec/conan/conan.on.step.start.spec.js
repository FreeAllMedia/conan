import Conan from "../../lib/conan.js";

describe("conan.events.on('step:start', handler)", () => {
	it("should call the provided handler each time a step starts", done => {
		const conan = new Conan();

		const calledSteps = [];

		conan
		.on("step:start", (deployer, step) => {
			calledSteps.push(step);
		})
		.step(function stepOne() {})
		.series(function stepTwo() {}).apply(1, 2, 3);

		conan
		.deploy(() => {
			calledSteps.should.eql([
				{ name: "stepOne", arguments: [conan] },
				{ name: "stepTwo", arguments: [conan, 1, 2, 3] }
			]);

			done();
		});
	});
});
