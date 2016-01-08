// HACK: parametrize and fix this
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = putIntegrationStep;
var requestTemplates = { "application/json": "{\n  \"params\": {\n      \"header\": {\n          \"accessToken\": \"$input.params(\"Access-Token\")\"\n      }\n  },\n  \"data\": {}\n}" };

function putIntegrationStep(conan, context, done) {
	var restApiId = context.results.restApiId;
	var resourceId = context.results.apiResourceId;
	var lambdaArn = context.results.lambdaArn;
	if (restApiId && resourceId && lambdaArn) {
		var api = new context.libraries.AWS.APIGateway({
			region: conan.config.region
		});

		var uri = "arn:aws:apigateway:" + conan.config.region + ":lambda:path/2015-03-31/functions/" + lambdaArn + "/invocations";

		var apiParameters = {
			restApiId: restApiId,
			resourceId: resourceId,
			type: "AWS",
			uri: uri,
			httpMethod: context.parameters.method(),
			integrationHttpMethod: "POST",
			requestTemplates: requestTemplates
		};
		api.putIntegration(apiParameters, function (error, response) {
			if (response) {
				done(null, {});
			} else {
				done(error);
			}
		});
	} else {
		done(null, {});
	}
}

module.exports = exports["default"];