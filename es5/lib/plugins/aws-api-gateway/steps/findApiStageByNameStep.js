"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = findApiStageByNameStep;

function findApiStageByNameStep(conan, context, done) {
	var api = new context.libraries.AWS.APIGateway({
		region: conan.config.region
	});
	var apiParameters = {
		restApiId: context.results.restApiId,
		stageName: context.parameters.name()
	};
	api.getStage(apiParameters, function (error, response) {
		if (response) {
			done(null, {
				stageName: response.stageName
			});
		} else if (error && error.statusCode === 404) {
			done();
		} else {
			done(error);
		}
	});
}

module.exports = exports["default"];