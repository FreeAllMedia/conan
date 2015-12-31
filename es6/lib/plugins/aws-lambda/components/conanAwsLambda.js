import ConanComponent from "../../../components/conanComponent.js";
import findLambdaByNameStep from "../steps/findLambdaByNameStep.js";
import findRoleByNameStep from "../steps/findRoleByNameStep.js";
import compileDependenciesStep from "../steps/compileDependenciesStep.js";
import compileLambdaZipStep from "../steps/compileLambdaZipStep.js";
import upsertLambdaStep from "../steps/upsertLambdaStep.js";

import privateData from "incognito";

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
			"publish",
			"key",
			"bucket",
			"packages",
			"dependencies"
		);

		this.name(name);
		this.filePath(filePath);
		this.handler(handler);

		// attach steps to conan
		const parameters = this.parameters();

		this.conan.steps.add(findLambdaByNameStep, this);
		this.conan.steps.add(findRoleByNameStep, this);
		this.conan.steps.add(compileDependenciesStep, this);
		this.conan.steps.add(compileLambdaZipStep, this);
		this.conan.steps.add(upsertLambdaStep, this);


		// thaumaturgy compilation, download and extraction
		// this.conan.steps.add(compileDependenciesStep, parameters);
		// tmp folder build with necessary code & zip creation
		// upload zip to s3
		// find lambda
		// create/update lambda
		//this.conan.steps.add(upsertLambdaByNameStep, parameters);
	}
}
