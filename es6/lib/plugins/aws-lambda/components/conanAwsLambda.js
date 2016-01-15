import ConanComponent from "../../../components/conanComponent.js";
import findLambdaByNameStep from "../steps/findLambdaByNameStep.js";
import findRoleByNameStep from "../steps/findRoleByNameStep.js";
import compilePackagesStep from "../steps/compilePackagesStep.js";
import compileLambdaZipStep from "../steps/compileLambdaZipStep.js";
import upsertLambdaStep from "../steps/upsertLambdaStep.js";

export default class ConanAwsLambda extends ConanComponent {
	initialize(conan, name, filePath, role) {
		this.conan = conan;

		this.parameters(
			"name",
			"filePath",
			"runtime",
			"role",
			"description",
			"memorySize",
			"timeout",
			"publish",
			"bucket",
			"packages"
		);

		this.multipleValueParameters(
			"handler"
		);

		this.aggregateValueParameters(
			"dependencies"
		);

		this.name(name);
		this.filePath(filePath);
		this.role(role);

		this.handler("handler");
		this.runtime("nodejs");
		this.memorySize(128);
		this.timeout(3);

		// attach steps to conan
		this.conan.steps.add(findLambdaByNameStep, this);
		this.conan.steps.add(findRoleByNameStep, this);
		this.conan.steps.add(compilePackagesStep, this);
		this.conan.steps.add(compileLambdaZipStep, this);
		this.conan.steps.add(upsertLambdaStep, this);
	}

	lambda(name) {
		return new ConanAwsLambda(this.conan, name);
	}
}
