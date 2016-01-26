import ConanComponent from "../../../components/conanComponent.js";
import findLambdaByNameStep from "../steps/findLambdaByNameStep.js";
import findRoleByNameStep from "../steps/findRoleByNameStep.js";
import createRoleStep from "../steps/createRoleStep.js";
import attachRolePolicyStep from "../steps/attachRolePolicyStep.js";
import buildPackageStep from "../steps/buildPackageStep.js";
import compileLambdaZipStep from "../steps/compileLambdaZipStep.js";
import upsertLambdaStep from "../steps/upsertLambdaStep.js";
import publishLambdaVersionStep from "../steps/publishLambdaVersionStep.js";
import findLambdaAliasStep from "../steps/findLambdaAliasStep.js";
import createLambdaAliasStep from "../steps/createLambdaAliasStep.js";
import updateLambdaAliasStep from "../steps/updateLambdaAliasStep.js";

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

		this.multipleValueAggregateParameters(
			"dependencies",
			"alias"
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
		this.conan.steps.add(createRoleStep, this);
		this.conan.steps.add(attachRolePolicyStep, this);
		this.conan.steps.add(buildPackageStep, this);
		this.conan.steps.add(compileLambdaZipStep, this);
		this.conan.steps.add(upsertLambdaStep, this);
		this.conan.steps.add(publishLambdaVersionStep, this);
		this.conan.steps.add(findLambdaAliasStep, this);
		this.conan.steps.add(createLambdaAliasStep, this);
		this.conan.steps.add(updateLambdaAliasStep, this);
	}

	lambda(name) {
		return new ConanAwsLambda(this.conan, name);
	}
}
