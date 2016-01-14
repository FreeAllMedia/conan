export default function updateApiStageStep(conan, context, done) {
	const api = new context.libraries.AWS.APIGateway({
		region: conan.config.region
	});
	if(context.results.restApiId && context.results.stageName) {
		const apiParameters = {
			restApiId: context.results.restApiId,
			stageName: context.parameters.name(),
			patchOperations: [
				{
					op: "replace",
					path: "/description",
					value: context.parameters.description()
				}
			]
		};
		api.updateStage(apiParameters,
			(error, response) => {
				if(response) {
					done(error, {
						deploymentId: response.deploymentId,
						stageName: context.parameters.name()
					});
				} else {
					done(error);
				}
			});
	} else {
		done();
	}
}
