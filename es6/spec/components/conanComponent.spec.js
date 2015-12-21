import ConanComponent from "../../lib/components/conanComponent.js";
import sinon from "sinon";

describe("ConanComponent()", () => {
	let component,
			parameters;

	class MyComponent extends ConanComponent {}

	beforeEach(() => {
		MyComponent.prototype.initialize = sinon.spy();
	});

	describe("(with parameters provided)", () => {
		beforeEach(() => {
			parameters = {
				some: "parameter"
			};

			component = new MyComponent(parameters);
		});

		it("should set .parameters to the supplied parameters", () => {
			component.parameters.should.eql(parameters);
		});

		it("should call .initialize with all constructor parameters", () => {
			component.initialize.calledWith(parameters).should.be.true;
		});
	});

	describe("(without parameters provided)", () => {
		beforeEach(() => {
			parameters = {
				some: "parameter"
			};

			component = new MyComponent();
		});

		it("should set component.parameters to an empty object", () => {
			component.parameters.should.eql({});
		});
	});
});
