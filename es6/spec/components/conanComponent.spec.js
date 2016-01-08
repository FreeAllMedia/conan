import ConanComponent from "../../lib/components/conanComponent.js";
import sinon from "sinon";

describe("ConanComponent()", () => {
	let component,
			name,
			age,
			initializeSpy;

	class MyComponent extends ConanComponent {
		initialize(newName, newAge) {
			initializeSpy(newName, newAge);
		}
	}

	beforeEach(() => {
		initializeSpy = sinon.spy();
		name = "Bob Belcher";
		age = 44;
		component = new MyComponent(name, age);
	});

	it("should stub .initialize", () => {
		class BlankComponent extends ConanComponent {}

		component = new BlankComponent();
		(typeof component.initialize).should.eql("function");
	});

	it("should call .initialize with all constructor parameters", () => {
		initializeSpy.calledWith(name, age).should.be.true;
	});

	describe(".parameters()", () => {
		it("should return all parameters in an object", () => {
			component.parameters("name", "age");
			component.name("Bob");
			component.age(44);
			component.parameters().should.eql({
				name: "Bob",
				age: 44
			});
		});
	});

	describe(".parameters(...newParameters)", () => {
		it("should create a getter and setter function for each new parameter", () => {
			component.parameters("name", "age");

			component.name(name);
			component.age(age);

			(component.name() === name && component.age() === age).should.be.true;
		});
	});
});
