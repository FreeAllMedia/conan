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

	it("should instantiate all ConanPlugins with conan", () => {
		const expectedResults = {
			testOne: conan.testOne,
			testTwo: conan.testTwo
		};

		expectedResults.should.eql({
			testOne: true,
			testTwo: true
		});
	});

	it("should add the instantiated plugin to the conan.plugins array", () => {
		conan.plugins[0].should.be.instanceOf(ConanPluginOne);
	});

	it("should add additional instantiated plugins to the conan.plugins array", () => {
		conan.plugins[1].should.be.instanceOf(ConanPluginTwo);
	});
});
