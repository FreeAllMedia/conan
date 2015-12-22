import ConanComponent from "../../../components/conanComponent.js";

export default class ConanAwsLambda extends ConanComponent {
	initialize(conan, name, filePath, handler) {
		this.conan = conan;

		this.parameters(
			"name",
			"filePath",
			"handler",
			"runtime",
			"role",
			"description",
			"memorySize",
			"timeout",
			"publish"
		);

		this.name(name);
		this.filePath(filePath);
		this.handler(handler);

		// attach steps to conan region
		// find lambda
		// create zip
		// create/update lambda
		// request method
		// response methods
	}
}
