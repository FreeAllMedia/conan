import Conan from "../../../conan.js";
import ConanAwsGatewayApi from "../components/conanAwsGatewayApi.js";
import ConanAwsGatewayApiPlugin from "../conanAwsGatewayApiPlugin.js";

describe("ConanAwsGatewayApiPlugin(conan)", () => {
	let conan,
			api;

	beforeEach(() => {
		conan = new Conan();
		conan.use(ConanAwsGatewayApiPlugin);
	});

  it("should setup conan.api()", () => {
		(typeof conan.api).should.eql("function");
	});

	it("should setup an empty object to hold apis at conan.apis", () => {
		conan.apis.should.eql({});
	});

	describe("conan.api(name)", () => {
		let name;

		beforeEach(() => {
			name = "MyAPI";

			api = conan.api(name);
		});

		it("should return an instance of ConanAwsGatewayApi", () => {
			api.should.be.instanceOf(ConanAwsGatewayApi);
		});

		it("should pass conan to the ConanAwsGatewayApi constructor", () => {
			api.conan.should.eql(conan);
		});

		it("should pass the api name to the ConanAwsGatewayApi constructor", () => {
			api.name().should.eql(name);
		});
	});
});
