import ConanAwsGatewayApi from "./components/conanAwsGatewayApi.js";
import AWS from "aws-sdk";

export default class ConanAwsGatewayApiPlugin {
	constructor (conan) {
		conan.api = this.api;
		conan.apis = {};
		conan.steps.library("AWS", AWS);
	}

	api(name) {
		return new ConanAwsGatewayApi(this, name);
	}
}
