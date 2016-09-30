import Conan from "../../lib/conan.js";

describe("conan.use(ConanPlugin)", () => {
	let conan,
			returnValue;

	class ConanPluginOne {
		constructor(conanObject) {
			this.conan = conanObject;
		}
	}
	class ConanPluginTwo {
		constructor(conanObject) {
			this.conan = conanObject;
		}
	}

	beforeEach(() => {
		conan = new Conan();
		returnValue = conan.use(
			ConanPluginOne,
			ConanPluginTwo
		);
	});

	it("should return conan to enable chaining", () => {
		returnValue.should.eql(conan);
	});

	it("should instantiate ConanPlugins with conan", () => {
		conan.plugins[0].conan.should.eql(conan);
	});

	it("should instantiate additional ConanPlugins with conan", () => {
		conan.plugins[1].conan.should.eql(conan);
	});

	it("should add the instantiated plugin to the conan.plugins array", () => {
		conan.plugins[0].should.be.instanceOf(ConanPluginOne);
	});

	it("should add additional instantiated plugins to the conan.plugins array", () => {
		conan.plugins[1].should.be.instanceOf(ConanPluginTwo);
	});
});
