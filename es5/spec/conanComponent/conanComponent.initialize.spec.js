import Conan, { ConanComponent } from "../../lib/index.js";
import ChainLink from "mrt";

describe("ConanComponent()", () => {
	let component,
			conan;

	class MyComponent extends ConanComponent {
		initialize(deployer) {
			this.conan = deployer;
		}
	}

	beforeEach(() => {
		conan = new Conan();
		conan.use(MyComponent);
		component = conan.components[0];
	});

	it("should inherit from ChainLink", () => {
		new ConanComponent().should.be.instanceOf(ChainLink);
	});

	it("should call the .initialize method with conan", () => {
		component.conan.should.eql(conan);
	});
});
