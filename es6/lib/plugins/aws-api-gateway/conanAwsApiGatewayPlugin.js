import ConanAwsApiGateway from "./components/conanAwsApiGateway.js";
import AWS from "aws-sdk";

export default class ConanAwsApiGatewayPlugin {
	constructor (conan) {
		conan.api = this.api;
		conan.apis = {};
		conan.steps.library("AWS", AWS);
	}

	api(name) {
		return new ConanAwsApiGateway(this, name);
	}
}
