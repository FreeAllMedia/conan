import Conan from "../../lib/conan.js";
import ConanContext from "../../lib/conanContext.js";

describe("conan.context", () => {
	it("should return an instance of ConanContext", () => {
		const conan = new Conan();

		conan.context.should.be.instanceOf(ConanContext);
	});
});
