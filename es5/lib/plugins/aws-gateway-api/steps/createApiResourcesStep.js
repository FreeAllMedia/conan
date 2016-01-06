"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = createApiResourcesStep;

function createApiResourcesStep(conan, context, done) {
	var api = new context.libraries.AWS.APIGateway({
		region: conan.config.region
	});
	var apiParameters = {};
	api.createResource(apiParameters, function (error) {
		done(error);
	});
}

module.exports = exports["default"];