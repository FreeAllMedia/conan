import Conan from "../../lib/conan.js";

describe("conan.use(ConanPlugin)", () => {
	class ConanPluginOne {
		constructor(conan) {
			conan.testOne = true;
		}
	}

	class ConanPluginTwo {
		constructor(conan) {
			conan.testTwo = true;
		}
	}

	let conan,
			returnValue;

	beforeEach(() => {
		conan = new Conan();
		returnValue = conan.use(ConanPluginOne, ConanPluginTwo);
	});

	it("should return conan to enable chaining", () => {
		returnValue.should.eql(conan);
	});

	it("should instantiate ConanPlugins with conan", () => {
		conan.testOne.should.be.true;
	});

	it("should instantiate additional ConanPlugins with conan", () => {
		conan.testTwo.should.be.true;
	});

	it("should add the instantiated plugin to the conan.plugins array", () => {
		conan.plugins[0].should.be.instanceOf(ConanPluginOne);
	});

	it("should add additional instantiated plugins to the conan.plugins array", () => {
		conan.plugins[1].should.be.instanceOf(ConanPluginTwo);
	});
});
