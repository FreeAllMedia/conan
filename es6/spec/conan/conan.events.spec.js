import Conan from "../../lib/conan.js";
import privateData from "incognito";

describe("conan.events", () => {
	it("should return staircase's event emitter", () => {
		const conan = new Conan();
		conan.events.should.eql(privateData(conan).staircase.events);
	});
});
