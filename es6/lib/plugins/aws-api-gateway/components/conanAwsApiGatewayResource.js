import ConanComponent from "../../../components/conanComponent.js";
import findApiResourceByPathStep from "../steps/findApiResourceByPathStep.js";
import createApiResourcesStep from "../steps/createApiResourcesStep.js";
import findResourceMethodStep from "../steps/findResourceMethodStep.js";
import createResourceMethodStep from "../steps/createResourceMethodStep.js";
import putIntegrationStep from "../steps/putIntegrationStep.js";
import putIntegrationResponseStep from "../steps/putIntegrationResponseStep.js";
import putMethodResponseStep from "../steps/putMethodResponseStep.js";
import findMethodResponseStep from "../steps/findMethodResponseStep.js";
import addPermissionStep from "../steps/addPermissionStep.js";
import getAccountIdStep from "../steps/getAccountIdStep.js";
import findLambdaByNameStep from "../../aws-lambda/steps/findLambdaByNameStep.js";

import findApiStageByNameStep from "../steps/findApiStageByNameStep.js";

export default class ConanAwsApiGatewayResource extends ConanComponent {
	initialize(conan, path, method) {
		this.conan = conan;

		this.parameters(
			"path",
			"method",
			"statusCodes",
			"responseHeaders"
		);

		this.multipleValueParameters(
			"lambda",
			"headers",
			"queryStrings"
		);

		this.path(path);
		this.method(method);
		this.headers();
		this.queryStrings();
		this.statusCodes({"200": ""});
		this.responseHeaders({});

		this.conan.steps.before(findApiStageByNameStep, findLambdaByNameStep, this);
		this.conan.steps.before(findApiStageByNameStep, findApiResourceByPathStep, this);
		this.conan.steps.before(findApiStageByNameStep, createApiResourcesStep, this);
		this.conan.steps.before(findApiStageByNameStep, findResourceMethodStep, this);
		this.conan.steps.before(findApiStageByNameStep, createResourceMethodStep, this);
		this.conan.steps.before(findApiStageByNameStep, putIntegrationStep, this);
		this.conan.steps.before(findApiStageByNameStep, putIntegrationResponseStep, this);
		this.conan.steps.before(findApiStageByNameStep, findMethodResponseStep, this);
		this.conan.steps.before(findApiStageByNameStep, putMethodResponseStep, this);
		this.conan.steps.before(findApiStageByNameStep, getAccountIdStep, this);
		this.conan.steps.before(findApiStageByNameStep, addPermissionStep, this);
	}

	get(path) {
		return new ConanAwsApiGatewayResource(this.conan, path, "GET");
	}

	post(path) {
		return new ConanAwsApiGatewayResource(this.conan, path, "POST");
	}

	put(path) {
		return new ConanAwsApiGatewayResource(this.conan, path, "PUT");
	}

	delete(path) {
		return new ConanAwsApiGatewayResource(this.conan, path, "DELETE");
	}

	options(path) {
		return new ConanAwsApiGatewayResource(this.conan, path, "OPTIONS");
	}
}
