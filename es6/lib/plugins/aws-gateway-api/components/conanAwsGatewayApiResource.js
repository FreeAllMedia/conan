import ConanComponent from "../../../components/conanComponent.js";
import findApiResourceByPathStep from "../steps/findApiResourceByPathStep.js";
import createApiResourcesStep from "../steps/createApiResourcesStep.js";

export default class ConanAwsGatewayApiResource extends ConanComponent {
	initialize(conan, path, method) {
		this.conan = conan;

		this.parameters(
			"path",
			"method"
		);

		this.path(path);
		this.method(method);

		this.conan.steps.add(findApiResourceByPathStep, this);
		this.conan.steps.add(createApiResourcesStep, this);
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
