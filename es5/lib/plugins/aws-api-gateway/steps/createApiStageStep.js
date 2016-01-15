"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = createApiStageStep;

function createApiStageStep(conan, context, done) {
	if (context.results.restApiId) {
		var api = new context.libraries.AWS.APIGateway({
			region: conan.config.region
		});
		var apiParameters = {
			restApiId: context.results.restApiId,
			stageName: context.parameters.name(),
			stageDescription: context.parameters.description(),
			description: "conan deployment for stage creation"
		};
		api.createDeployment(apiParameters, function (error, response) {
			if (response) {
				done(error, {
					deploymentId: response.id,
					stageName: context.parameters.name()
				});
			} else {
				done(error);
			}
		});
	} else {
		done();
	}
}

module.exports = exports["default"];