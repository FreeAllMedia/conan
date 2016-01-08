export default function createResourceMethodStep(conan, context, done) {
	const restApiId = context.results.restApiId;
	let resourceId = context.results.apiResourceId;
	if(restApiId
			&& resourceId) {
		const api = new context.libraries.AWS.APIGateway({
			region: conan.config.region
		});
		const apiParameters = {
			restApiId,
			resourceId,
			httpMethod: context.parameters.method()
		};
		api.putMethod(apiParameters,
			(error, response) => {
				if(response) {
					done(null, { resourceHttpMethod: response.httpMethod });
				} else {
					done(error);
				}
			});
	} else {
		done(null, { resourceHttpMethod: null });
	}
}
