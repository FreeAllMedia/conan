import requireHack from "../lib/babel6.require.hack.js";
import Module from "module";

describe("babel6 require hack", () => {
	let oldRequire;

	beforeEach(() => {
		oldRequire = Module.prototype.require;
	});

	afterEach(() => {
		Module.prototype.require = oldRequire;
	});

	it("should override the module require function", () => {
		requireHack();
		require("./fixtures/module.js").name.should.equal("Apple");
	});

	it("should override the module require function for es5 too", () => {
		const oldAssign = Object.assign;
		Object.assign = undefined;
		requireHack();
		require("./fixtures/module.js").name.should.equal("Apple");
		Object.assign = oldAssign;
	});
});
