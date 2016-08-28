import Conan, { ConanComponent } from "../../lib/index.js";

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
		conan.link("myComponent", MyComponent);
		component = conan.myComponent();
	});

	it("should call the .initialize method with conan", () => {
		component.conan.should.eql(conan);
	});
});
