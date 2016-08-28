import Conan from "../../lib/conan.js";
import ConanPlugin from "../../lib/conanPlugin.js";
import ChainLink from "mrt";

describe("ConanPlugin()", () => {
	let plugin,
			conan;

	class MyPlugin extends ConanPlugin {
		initialize(deployer) {
			this.conan = deployer;
		}
	}

	beforeEach(() => {
		conan = new Conan();
		conan.use(MyPlugin);
		plugin = conan.plugins[0];
	});

	it("should inherit from ChainLink", () => {
		new ConanPlugin().should.be.instanceOf(ChainLink);
	});

	it("should call the .initialize method with conan", () => {
		plugin.conan.should.eql(conan);
	});
});
