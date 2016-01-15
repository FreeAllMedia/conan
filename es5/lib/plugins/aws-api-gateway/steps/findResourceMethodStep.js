export default function findResourceMethodStep(conan, context, done) {
	const restApiId = context.results.restApiId;
	const resourceId = context.results.apiResourceId;
	if(restApiId
		&& resourceId) {
			const api = new context.libraries.AWS.APIGateway({
				region: conan.config.region
			});
			const apiParameters = {
				httpMethod: context.parameters.method(),
				resourceId,
				restApiId
			};
			api.getMethod(apiParameters,
				(error, response) => {
					if(response) {
						done(null, {
							resourceHttpMethod: response.httpMethod
						});
					} else if(error && error.statusCode === 404) {
						done(null, {
							resourceHttpMethod: null
						});
					} else{
						done(error);
					}
				});
	} else {
		done();
	}
}
