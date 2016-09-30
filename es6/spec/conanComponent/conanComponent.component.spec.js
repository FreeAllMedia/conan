import { ConanComponent } from "../../lib/index.js";

describe("ConanComponent()", () => {
	let component;

	class ComponentOne extends ConanComponent {
		initialize() {
			this.component("two", ComponentTwo);
		}
	}

	class ComponentTwo extends ConanComponent {
		initialize(one) {
			this.one = one;
		}
	}

	beforeEach(() => {
		component = new ComponentOne();
	});

	it("should call the c.initialize method with the parent object as the sole argument", () => {
		const two = component.two();
		two.one.should.eql(component);
	});
});
