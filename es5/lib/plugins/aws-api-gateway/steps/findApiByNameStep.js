"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = findApiByNameStep;
function findApiByNameStep(conan, context, done) {
	var api = new context.libraries.AWS.APIGateway({
		region: conan.config.region
	});
	var apiParameters = {};
	api.getRestApis(apiParameters, function (error, response) {
		if (error && error.statusCode >= 300) {
			done(error);
		} else if (response) {
			var item = response.items.find(function (currentItem) {
				return currentItem.name === context.parameters.name();
			});
			if (item) {
				done(null, {
					restApiId: item.id
				});
			} else {
				done();
			}
		} else {
			done();
		}
	});
}