import ConanComponent from "../../../components/conanComponent.js";
import findLambdaByNameStep from "../steps/findLambdaByNameStep.js";
// import upsertLambdaByNameStep from "../steps/upsertLambdaByNameStep.js";
// import compileDependenciesStep from "../steps/compileDependenciesStep.js";

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

		this.conan.steps.add(findLambdaByNameStep, parameters);


		// thaumaturgy compilation, download and extraction
		// this.conan.steps.add(compileDependenciesStep, parameters);
		// tmp folder build with necessary code & zip creation
		// upload zip to s3
		// find lambda
		// create/update lambda
		//this.conan.steps.add(upsertLambdaByNameStep, parameters);
	}
}
