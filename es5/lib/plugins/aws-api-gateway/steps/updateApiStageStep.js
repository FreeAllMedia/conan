"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = updateApiStageStep;

function updateApiStageStep(conan, context, done) {
	var api = new context.libraries.AWS.APIGateway({
		region: conan.config.region
	});
	if (context.results.restApiId && context.results.stageName) {
		var apiParameters = {
			restApiId: context.results.restApiId,
			stageName: context.parameters.name(),
			patchOperations: [{
				op: "replace",
				path: "/description",
				value: context.parameters.description()
			}]
		};
		api.updateStage(apiParameters, function (error, response) {
			if (response) {
				done(error, {
					deploymentId: response.deploymentId,
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