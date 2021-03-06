import Conan from "../../lib/conan.js";

describe("conan.use(ConanPlugin)", () => {
	class ConanPlugin {
		constructor(conan) {
			conan.test = true;
		}
	}

	let conan;

	beforeEach(() => {
		conan = new Conan();
		conan.use(ConanPlugin);
	});

	it("should instantiate the ConanPlugin with conan", () => {
		conan.test.should.be.true;
	});

	it("should add the instantiated plugin to the conan.plugins array", () => {
		conan.plugins[0].should.be.instanceOf(ConanPlugin);
	});
});
