import ConanComponent from "../../../components/conanComponent.js";

export default class ConanAwsGatewayApiStage extends ConanComponent {
	initialize(api, name) {
		this.api = api;

		this.parameters(
			"name"
		);

		this.name(name);
	}
}
