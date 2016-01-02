import ConanComponent from "../../../components/conanComponent.js";
import findLambdaByNameStep from "../steps/findLambdaByNameStep.js";
import findRoleByNameStep from "../steps/findRoleByNameStep.js";
import compilePackagesStep from "../steps/compilePackagesStep.js";
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
		this.conan.steps.add(findLambdaByNameStep, this);
		this.conan.steps.add(findRoleByNameStep, this);
		this.conan.steps.add(compilePackagesStep, this);
		this.conan.steps.add(compileLambdaZipStep, this);
		this.conan.steps.add(upsertLambdaStep, this);
	}
}
