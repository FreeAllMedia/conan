import Conan from "../../lib/conan.js";

describe("conan.plugins", () => {
	it("should return an instance of Array", () => {
		const conan = new Conan();
		conan.plugins.should.be.instanceOf(Array);
	});
});
