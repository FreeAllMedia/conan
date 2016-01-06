export default function createApiResourcesStep(conan, context, done) {
	const api = new context.libraries.AWS.APIGateway({
		region: conan.config.region
	});
	const apiParameters = {
	};
	api.createResource(apiParameters,
		(error) => {
			done(error);
		});
}
