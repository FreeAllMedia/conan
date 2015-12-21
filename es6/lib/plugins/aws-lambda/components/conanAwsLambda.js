import ConanComponent from "../../../components/conanComponent.js";

export default class ConanAwsLambda extends ConanComponent {
	initialize(conan, name, path, handler) {
		this.conan = conan;

		this.parameters.name = name;
		this.parameters.path = path;
		this.parameters.handler = handler;
	}

	runtime(runtime) {
		return this;
	}

	// .runtime("nodejs")
	// .role("lambdaRole")
	// .description("This is my Lambda!")
	// .memorySize(0)
	// .timeout(60)
	// .publish(true) // defaults to true
}
