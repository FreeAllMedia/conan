import Conan from "../lib/conan.js";
import ChainLink from "mrt";

describe("Conan(config)", () => {
	let conan;

	beforeEach(() => {
		conan = new Conan();
	});

	it("should extend ChainLink", () => {
		conan.should.be.instanceOf(ChainLink);
	});

	describe("(with a config object)", () => {
		it("should not throw an error", () => {
			(() => {
				const config = {key: "value"};
				conan = new Conan(config);
			}).should.not.throw();
		});

		it("should save config object to conan.config", () => {
			const config = {key: "value"};
			conan = new Conan(config);
			conan.config.should.eql(config);
		});
	});

	describe("(without a config object)", () => {
		it("should save an empty object to conan.config", () => {
			conan.config.should.eql({});
		});
	});
});
