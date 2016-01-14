import ConanComponent from "../../../components/conanComponent.js";
import ConanAwsApiGatewayStage from "./conanAwsApiGatewayStage.js";
import findApiByNameStep from "../steps/findApiByNameStep.js";
import updateApiStep from "../steps/updateApiStep.js";
import createApiStep from "../steps/createApiStep.js";

export default class ConanAwsApiGateway extends ConanComponent {
	initialize(conan, name) {
		this.conan = conan;

		this.parameters(
			"name"
		);

		this.name(name);

		// find api by name
		this.conan.steps.add(findApiByNameStep, this);
		this.conan.steps.add(updateApiStep, this);
		this.conan.steps.add(createApiStep, this);
	}

	stage(name) {
		return new ConanAwsApiGatewayStage(this.conan, name);
	}

	api(name) {
		return new ConanAwsApiGateway(this.conan, name);
	}
}
