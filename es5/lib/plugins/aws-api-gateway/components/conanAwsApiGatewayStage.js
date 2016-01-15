import ConanComponent from "../../../components/conanComponent.js";
import ConanAwsApiGatewayResource from "./conanAwsApiGatewayResource.js";
import findApiStageByNameStep from "../steps/findApiStageByNameStep.js";
import updateApiStageStep from "../steps/updateApiStageStep.js";
import createApiStageStep from "../steps/createApiStageStep.js";
//potential circular dep
import ConanAwsApiGateway from "./conanAwsApiGateway.js";

export default class ConanAwsApiGatewayStage extends ConanComponent {
	initialize(conan, name) {
		this.conan = conan;

		this.parameters(
			"name",
			"description"
		);

		this.name(name);

		this.conan.steps.add(findApiStageByNameStep, this);
		this.conan.steps.add(updateApiStageStep, this);
		this.conan.steps.add(createApiStageStep, this);
	}

	api(name) {
		return new ConanAwsApiGateway(this.conan, name);
	}

	get(path) {
		return new ConanAwsApiGatewayResource(this.conan, path, "GET");
	}

	post(path) {
		return new ConanAwsApiGatewayResource(this.conan, path, "POST");
	}

	put(path) {
		return new ConanAwsApiGatewayResource(this.conan, path, "PUT");
	}

	delete(path) {
		return new ConanAwsApiGatewayResource(this.conan, path, "DELETE");
	}
}
