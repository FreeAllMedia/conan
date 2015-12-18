import ConanAwsApiPlugin from "../conan.api.plugin.js";
import Conan from "../../../conan.js";

describe("ConanAwsApiPlugin(conan)", () => {
	let conan;

	before(() => {
		conan = new Conan();
		conan.use(ConanAwsApiPlugin);
	});

	it("should set a builder function for ConanAwsApi at .api(apiName)", () => {
		(typeof conan.api).should.equal("function");
	});
});
