import ConanComponent from "../../lib/components/conanComponent.js";
import sinon from "sinon";

describe("ConanComponent()", () => {
	let component,
			parameters,
			initializeSpy;

	class MyComponent extends ConanComponent {
		initialize(some) {
			initializeSpy(some);
			if(some) {
				this.parameters.some = some;
			}
		}
	}

	beforeEach(() => {
		initializeSpy = sinon.spy();
	});

	describe("(with parameters provided)", () => {
		beforeEach(() => {
			parameters = {
				some: "parameter"
			};

			component = new MyComponent(parameters.some);
		});

		it("should set .parameters to the supplied parameters", () => {
			component.parameters.should.eql(parameters);
		});

		it("should call .initialize with all constructor parameters", () => {
			initializeSpy.calledWith(parameters.some).should.be.true;
		});
	});

	describe("(without parameters provided)", () => {
		class MyEmptyComponent extends ConanComponent {}

		beforeEach(() => {
			component = new MyEmptyComponent();
		});

		it("should set component.parameters to an empty object", () => {
			component.parameters.should.eql({});
		});
	});
});
