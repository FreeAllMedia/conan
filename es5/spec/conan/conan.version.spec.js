import Conan from "../../lib/conan.js";
import packageJson from "../../../package.json";

describe("conan.version", () => {
	it("should return the current version of conan.", () => {
		const conan = new Conan();

		conan.version.should.eql(packageJson.version);
	});
});
