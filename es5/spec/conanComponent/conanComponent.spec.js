import { ConanComponent } from "../../lib/index.js";
import ChainLink from "mrt";

describe("ConanComponent()", () => {
	it("should inherit from ChainLink", () => {
		new ConanComponent().should.be.instanceOf(ChainLink);
	});
});
