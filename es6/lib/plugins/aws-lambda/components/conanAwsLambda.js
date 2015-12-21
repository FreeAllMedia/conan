import ConanComponent from "../../../components/conanComponent.js";

export default class ConanAwsLambda extends ConanComponent {
	initialize(conan, name, filePath, handler) {
		this.conan = conan;

		this.parameters.name = name;
		this.parameters.filePath = filePath;
		this.parameters.handler = handler;
	}

	runtime(runtime) {
		this.parameters.runtime = runtime;
		return this;
	}

	// .runtime("nodejs")
	// .role("lambdaRole")
	// .description("This is my Lambda!")
	// .memorySize(0)
	// .timeout(60)
	// .publish(true) // defaults to true
}
