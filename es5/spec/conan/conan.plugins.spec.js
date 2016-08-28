import Conan from "../../lib/conan.js";

describe("conan.plugins", () => {
	let conan;

	class ConanPlugin {}

	beforeEach(() => {
		conan = new Conan();
		conan.use(ConanPlugin);
	});

	it("should return an instance of Array", () => {
		conan.plugins[0].should.be.instanceOf(ConanPlugin);
	});
});
