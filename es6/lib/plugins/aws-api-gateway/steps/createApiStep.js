export default function createApiStep(conan, context, done) {
	if(!context.results.restApiId) {
		const api = new context.libraries.AWS.APIGateway({
			region: conan.config.region
		});
		const apiParameters = {
			name: context.parameters.name()
		};
		api.createRestApi(apiParameters,
			(error, response) => {
				if(response) {
					done(error, {
						restApiId: response.id
					});
				} else {
					done(error);
				}
			});
	} else {
		done();
	}
}
