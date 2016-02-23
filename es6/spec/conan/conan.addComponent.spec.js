import Conan from "../../lib/conan.js";

describe("conan.addComponent(componentName, ComponentConstructor)", () => {
	class ServerComponent {
		constructor(...parameters) {
			this.parameters = parameters;
		}
	}

	let conan;

	beforeEach(() => {
		conan = new Conan();
		conan.addComponent("server", ServerComponent);
	});

	it("should pass conan as the last parameter to the component constructor", () => {
		const parameters = [1, 2, 3];
		const server = conan.server(...parameters);
		server.parameters[server.parameters.length - 1].should.eql(conan);
	});

	it("should pass the parameters to the component constructor", () => {
		const parameters = [1, 2, 3];
		const server = conan.server(...parameters);
		parameters.push(conan);
		server.parameters.should.eql(parameters);
	});

	it("should return a new instance of component each time it is called", () => {
		const server = conan.server("127.0.0.1");
		server.should.be.instanceOf(ServerComponent);
	});

	it("should add the component instance to .components[componentName]", () => {
		const server = conan.server("127.0.0.1");
		conan.components.server[0].should.eql(server);
	});

	it("should add the component instance to .components[all]", () => {
		const server = conan.server("127.0.0.1");
		conan.components.all[0].should.eql(server);
	});
});
