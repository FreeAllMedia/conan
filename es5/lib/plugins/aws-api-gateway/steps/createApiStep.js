"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = createApiStep;
function createApiStep(conan, context, done) {
	if (!context.results.restApiId) {
		var api = new context.libraries.AWS.APIGateway({
			region: conan.config.region
		});
		var apiParameters = {
			name: context.parameters.name()
		};
		api.createRestApi(apiParameters, function (error, response) {
			if (response) {
				done(error, {
					restApiId: response.id
				});
			} else {
				done(error);
			}
		});
	} else {
		done();
	}
}