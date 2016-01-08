import ConanComponent from "../../../components/conanComponent.js";
import ConanAwsGatewayApiResource from "./conanAwsGatewayApiResource.js";
import findApiStageByNameStep from "../steps/findApiStageByNameStep.js";
import updateApiStageStep from "../steps/updateApiStageStep.js";
import createApiStageStep from "../steps/createApiStageStep.js";
//potential circular dep
import ConanAwsGatewayApi from "./conanAwsGatewayApi.js";

export default class ConanAwsGatewayApiStage extends ConanComponent {
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
		return new ConanAwsGatewayApi(this.conan, name);
	}

	get(path) {
		return new ConanAwsGatewayApiResource(this.conan, path, "GET");
	}

	post(path) {
		return new ConanAwsGatewayApiResource(this.conan, path, "POST");
	}

	put(path) {
		return new ConanAwsGatewayApiResource(this.conan, path, "PUT");
	}

	delete(path) {
		return new ConanAwsGatewayApiResource(this.conan, path, "DELETE");
	}
}
