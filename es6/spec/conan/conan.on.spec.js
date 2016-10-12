import Conan from "../../lib/conan.js";

describe("conan.on", () => {
	let conan;

	beforeEach(() => {
		conan = new Conan();
	});

	it("should create a new event handler", done => {
		conan.on("test", (one, two) => {
			[one, two].should.eql([1, 2]);
			done();
		});

		conan.events.emit("test", 1, 2);
	});

	it("should return this to enable chaining", () => {
		conan.on("something", () => {}).should.eql(conan);
	});
});
