import flowsync from "flowsync";

export default function createApiResourcesStep(conan, context, done) {
	const restApiId = context.results.restApiId;
	let parentId = context.results.apiResourceParentId;
	let leafResourceId = null;
	if(restApiId
			&& parentId
			&& Array.isArray(context.results.newApiResources)) {
		const api = new context.libraries.AWS.APIGateway({
			region: conan.config.region
		});
		flowsync.eachSeries(context.results.newApiResources,
				(pathPart, nextResource) => {
					const apiParameters = {
						restApiId,
						parentId,
						pathPart
					};
					api.createResource(apiParameters,
						(error, response) => {
							if(response) {
								leafResourceId = response.id;
								// override with the new parent id for the next resource
								parentId = response.id;
							}
							nextResource(error);
						});
				},
				(error) => {
					let results = {};
					if(leafResourceId || error) {
						results.apiResourceId = leafResourceId;
					}
					done(error, results);
				});
	} else {
		done(null, { apiResourceId: null });
	}
}
