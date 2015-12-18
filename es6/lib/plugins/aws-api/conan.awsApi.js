import conanFindApiStep from "./steps/conan.findApi.step.js";
import AwsApiBuilder from "./awsApiBuilder.js";

export default class ConanAwsApi {
	constructor(conan) {
		conan.api = (name) => {
			const awsApiBuilder = new AwsApiBuilder(name);
			conan.steps.add(conanFindApiStep); // HACK: idea: step data structure maybe as second arg here?
			return awsApiBuilder;
		};
	}
}
