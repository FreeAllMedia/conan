import ConanComponent from "../../../components/conanComponent.js";
import findApiStageByNameStep from "../steps/findApiStageByNameStep.js";
import updateApiStageStep from "../steps/updateApiStageStep.js";
import createApiStageStep from "../steps/createApiStageStep.js";

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
}

//circular dep
import ConanAwsGatewayApi from "./conanAwsGatewayApi.js";
