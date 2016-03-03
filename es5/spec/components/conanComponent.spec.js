import ConanComponent from "../../lib/components/conanComponent.js";
import sinon from "sinon";

describe("ConanComponent()", () => {
	let conanComponent,
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
		conanComponent = new MyComponent(name, age);
	});

	it("should stub .initialize", () => {
		class BlankComponent extends ConanComponent {}

		conanComponent = new BlankComponent();
		(typeof conanComponent.initialize).should.eql("function");
	});

	it("should call .initialize with all constructor parameters", () => {
		initializeSpy.calledWith(name, age).should.be.true;
	});

	describe(".parameters([...newParameters])", () => {
		it("should create a getter and setter function for each new parameter", () => {
			conanComponent.parameters("name", "age");

			conanComponent.name(name);
			conanComponent.age(age);

			(conanComponent.name() === name && conanComponent.age() === age).should.be.true;
		});
		it("should create a getter and setter function for each new parameter", () => {
			conanComponent.parameters("name", "age");

			conanComponent.name(name);
			conanComponent.age(age);

			conanComponent.parameters().should.eql({
				name: name,
				age: age
			});
		});
	});

	describe(".multipleValueParameters(...parameterNames)", () => {
		it("should create a getter and setter function for each new parameter with multiple arguments", () => {
			const valueOne = "SomeValue";
			const valueTwo = "AnotherValue";

			conanComponent.multipleValueParameters("handler");
			conanComponent.handler(valueOne, valueTwo);
			conanComponent.handler().should.eql([
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

			conanComponent.aggregateValueParameters("something");
			conanComponent.something(valueOne);
			conanComponent.something(valueTwo, valueThree);
		});
		it("should create a getter and setter function for each new parameter with aggregate values", () => {
			conanComponent.something().should.eql([
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

			conanComponent.multipleValueAggregateParameters("handler");
			conanComponent.handler(valueOne, valueTwo);
			conanComponent.handler(valueThree, valueFour);
			conanComponent.handler().should.eql([
				[ valueOne,	valueTwo ],
				[	valueThree,	valueFour	]
			]);
		});

		it("should initialize with an empty array as the value", () => {
			conanComponent.multipleValueAggregateParameters("handler");
			conanComponent.handler().should.eql([]);
		});
	});
});
