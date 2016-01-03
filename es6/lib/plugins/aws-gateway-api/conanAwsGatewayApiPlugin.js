import ConanAwsGatewayApi from "./components/conanAwsGatewayApi.js";

export default class ConanAwsGatewayApiPlugin {
	constructor (conan) {
		conan.api = this.api;
		conan.apis = {};
	}

	api(name) {
		return new ConanAwsGatewayApi(this, name);
	}
}
