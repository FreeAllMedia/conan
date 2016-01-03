import ConanComponent from "../../../components/conanComponent.js";

export default class ConanAwsGatewayApi extends ConanComponent {
	initialize(conan, name) {
		this.conan = conan;

		this.parameters(
			"name"
		);

		this.name(name);

		// this.conan.steps.add(upsertLambdaStep, this);
	}
}
