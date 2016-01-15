export default function updateApiStep(conan, context, done) {
	const api = new context.libraries.AWS.APIGateway({
		region: conan.config.region
	});
	if(!context.results.restApiId) {
		done();
	} else {
		const apiParameters = {
			restApiId: context.results.restApiId,
			patchOperations: [
				{
					op: "replace",
					path: "/name",
					value: context.parameters.name()
				}
			]
		};
		api.updateRestApi(apiParameters,
			(error) => {
				done(error);
			});
	}
}
