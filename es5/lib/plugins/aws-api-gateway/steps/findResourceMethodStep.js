"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = findResourceMethodStep;
function findResourceMethodStep(conan, context, done) {
	var restApiId = context.results.restApiId;
	var resourceId = context.results.apiResourceId;
	if (restApiId && resourceId) {
		var api = new context.libraries.AWS.APIGateway({
			region: conan.config.region
		});
		var apiParameters = {
			httpMethod: context.parameters.method(),
			resourceId: resourceId,
			restApiId: restApiId
		};
		api.getMethod(apiParameters, function (error, response) {
			if (response) {
				done(null, {
					resourceHttpMethod: response.httpMethod
				});
			} else if (error && error.statusCode === 404) {
				done(null, {
					resourceHttpMethod: null
				});
			} else {
				done(error);
			}
		});
	} else {
		done();
	}
}