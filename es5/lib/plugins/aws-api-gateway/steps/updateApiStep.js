"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = updateApiStep;

function updateApiStep(conan, context, done) {
	var api = new context.libraries.AWS.APIGateway({
		region: conan.config.region
	});
	if (!context.results.restApiId) {
		done();
	} else {
		var apiParameters = {
			restApiId: context.results.restApiId,
			patchOperations: [{
				op: "replace",
				path: "/name",
				value: context.parameters.name()
			}]
		};
		api.updateRestApi(apiParameters, function (error) {
			done(error);
		});
	}
}

module.exports = exports["default"];