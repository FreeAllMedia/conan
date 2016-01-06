/*
* It finds a resource by his full path and returns it's id and it's parentId
* If it's necessary it builds a queue with resource tokens that needs to be created
* and returns the id of the closest existing parent resource, or the root
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = findApiResourceByPathStep;

function findApiResourceByPathStep(conan, context, done) {
	var restApiId = context.results.restApiId;
	var resourceFullPath = context.parameters.path();
	var newApiResources = [];
	if (restApiId) {
		var api = new context.libraries.AWS.APIGateway({
			region: conan.config.region
		});
		var apiParameters = {
			restApiId: restApiId,
			limit: 500
		};
		api.getResources(apiParameters, function (error, response) {
			if (response && response.items) {
				var resource = response.items.find(function (currentResource) {
					return currentResource.path === resourceFullPath;
				});
				if (resource) {
					var results = { newApiResources: newApiResources, resourceId: resource.id, resourceParentId: resource.parentId };
					done(null, results);
				} else {
					(function () {
						// partial matching
						var pathTokens = resourceFullPath.split("/");
						var accumulatedResourcePath = "";
						var lastResourceFound = undefined;
						pathTokens.forEach(function (pathToken) {
							if (pathToken !== "") {
								accumulatedResourcePath += "/" + pathToken;
								var lastResourceFoundTmp = response.items.find(function (currentResource) {
									return currentResource.path === accumulatedResourcePath;
								});
								if (lastResourceFoundTmp) {
									lastResourceFound = lastResourceFoundTmp;
								} else {
									newApiResources.push(pathToken);
								}
							}
						});
						var results = { newApiResources: newApiResources };
						if (lastResourceFound) {
							results.resourceParentId = lastResourceFound.id;
						} else {
							// resource unexisting at all, find root
							var rootResource = response.items.find(function (currentResource) {
								return currentResource.path === "/";
							});
							results.resourceParentId = rootResource.id;
						}
						done(null, results);
					})();
				}
			} else {
				done(error);
			}
		});
	} else {
		done(new Error("There is no api defined as a previous step or there was an error o that step."));
	}
}

module.exports = exports["default"];