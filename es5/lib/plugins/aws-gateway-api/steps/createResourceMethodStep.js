"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = createResourceMethodStep;

function createResourceMethodStep(conan, context, done) {
	var restApiId = context.results.restApiId;
	var resourceId = context.results.apiResourceId;
	if (restApiId && resourceId && !context.results.resourceHttpMethod) {
		var api = new context.libraries.AWS.APIGateway({
			region: conan.config.region
		});
		var apiParameters = {
			restApiId: restApiId,
			resourceId: resourceId,
			httpMethod: context.parameters.method(),
			authorizationType: "none"
		};
		api.putMethod(apiParameters, function (error, response) {
			if (response) {
				done(null, { resourceHttpMethod: response.httpMethod });
			} else {
				done(error);
			}
		});
	} else {
		done(null, { resourceHttpMethod: null });
	}
}

module.exports = exports["default"];