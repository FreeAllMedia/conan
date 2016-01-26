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

	describe(".parameters([...newParameters])", () => {
		it("should create a getter and setter function for each new parameter", () => {
			component.parameters("name", "age");

			component.name(name);
			component.age(age);

			(component.name() === name && component.age() === age).should.be.true;
		});
		it("should create a getter and setter function for each new parameter", () => {
			component.parameters("name", "age");

			component.name(name);
			component.age(age);

			component.parameters().should.eql({
				name: name,
				age: age
			});
		});
	});

	describe(".multipleValueParameters(...parameterNames)", () => {
		it("should create a getter and setter function for each new parameter with multiple arguments", () => {
			const valueOne = "SomeValue";
			const valueTwo = "AnotherValue";

			component.multipleValueParameters("handler");
			component.handler(valueOne, valueTwo);
			component.handler().should.eql([
				valueOne,
				valueTwo
			]);
		});
	});

	describe(".aggregateValueParameters(...parameterNames)", () => {
		let valueOne;
		let valueTwo;
		let valueThree;

		beforeEach(() => {
			valueOne = "SomeValue";
			valueTwo = "AnotherValue";
			valueThree = "YetAnotherValue";

			component.aggregateValueParameters("something");
			component.something(valueOne);
			component.something(valueTwo, valueThree);
		});
		it("should create a getter and setter function for each new parameter with aggregate values", () => {
			component.something().should.eql([
				valueOne,
				valueTwo,
				valueThree
			]);
		});
	});

	describe(".multipleValueAggregateParameters(...parameterNames)", () => {
		it("should create a getter and setter function for each new parameter with multiple arguments", () => {
			const valueOne = "SomeValue";
			const valueTwo = "AnotherValue";
			const valueThree = "SomeValueAgain";
			const valueFour = "AnotherValueAgain";

			component.multipleValueAggregateParameters("handler");
			component.handler(valueOne, valueTwo);
			component.handler(valueThree, valueFour);
			component.handler().should.eql([
				[ valueOne,	valueTwo ],
				[	valueThree,	valueFour	]
			]);
		});

		it("should initialize with an empty array as the value", () => {
			component.multipleValueAggregateParameters("handler");
			component.handler().should.eql([]);
		});
	});
});
