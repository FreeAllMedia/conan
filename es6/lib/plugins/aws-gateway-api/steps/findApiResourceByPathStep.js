/*
* It finds a resource by his full path and returns it's id and it's parentId
* If it's necessary it builds a queue with resource tokens that needs to be created
* and returns the id of the closest existing parent resource, or the root
*/
export default function findApiResourceByPathStep(conan, context, done) {
	const restApiId = context.results.restApiId;
	const resourceFullPath = context.parameters.path();
	const newApiResources = [];
	if(restApiId) {
		const api = new context.libraries.AWS.APIGateway({
			region: conan.config.region
		});
		const apiParameters = {
			restApiId,
			limit: 500
		};
		api.getResources(apiParameters,
			(error, response) => {
				if(response && response.items) {
					const resource = response.items.find((currentResource) => {
						return (currentResource.path === resourceFullPath);
					});
					if(resource) {
						const results = { newApiResources, apiResourceId: resource.id, apiResourceParentId: resource.parentId };
						done(null, results);
					} else {
						// partial matching
						const pathTokens = resourceFullPath.split("/");
						let accumulatedResourcePath = "";
						let lastResourceFound;
						pathTokens.forEach(
							(pathToken) => {
								if(pathToken !== "") {
									accumulatedResourcePath += `/${pathToken}`;
									const lastResourceFoundTmp = response.items.find((currentResource) => {
										return (currentResource.path === accumulatedResourcePath);
									});
									if(lastResourceFoundTmp) {
										lastResourceFound = lastResourceFoundTmp;
									} else {
										newApiResources.push(pathToken);
									}
								}
							}
						);
						const results = { newApiResources };
						if(lastResourceFound) {
							results.apiResourceParentId = lastResourceFound.id;
						} else {
							// resource unexisting at all, find root
							const rootResource = response.items.find((currentResource) => {
								return (currentResource.path === "/");
							});
							results.apiResourceParentId = rootResource.id;
						}
						results.apiResourceId = null;
						done(null, results);
					}
				} else {
					done(error, {apiResourceId: null});
				}
			});
	} else {
		done(new Error("There is no api defined as a previous step or there was an error o that step."));
	}
}
