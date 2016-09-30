import Conan from "../../lib/conan.js";

describe("Conan(config)", () => {
	it("should instantiate without an error", () => {
		(() => {
			const conan = new Conan();
			conan;
		}).should.not.throw();
	});
});
