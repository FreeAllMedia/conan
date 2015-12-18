import conanFindApiStep from "./steps/conan.findApi.step.js";
import AwsApiBuilder from "./awsApiBuilder.js";
import privateData from "incognito";

export default class ConanAwsApiPlugin {
	constructor(conan) {
		privateData(this).conan = conan;
		conan.api = this.newApi;
	}

	newApi(name) {
		const conan = privateData(this).conan;
		return new ConanAwsApi(conan, name);
	}
}
