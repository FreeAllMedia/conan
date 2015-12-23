import ConanComponent from "../../../components/conanComponent.js";
import findLambdaByNameStep from "../steps/findLambdaByNameStep.js";
import upsertLambdaByNameStep from "../steps/upsertLambdaByNameStep.js";

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

		// attach steps to conan
		const parameters = this.parameters();
		// find lambda
		this.conan.steps.add(findLambdaByNameStep, parameters);
		// create zip
		// create/update lambda
		this.conan.steps.add(upsertLambdaByNameStep, parameters);
		// request method
		// response methods
	}
}
