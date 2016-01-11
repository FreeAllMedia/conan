export default function createApiStageStep(conan, context, done) {
	if(context.results.restApiId) {
		const api = new context.libraries.AWS.APIGateway({
			region: conan.config.region
		});
		const apiParameters = {
			restApiId: context.results.restApiId,
			stageName: context.parameters.name(),
			stageDescription: context.parameters.description(),
			description: "conan deployment for stage creation"
		};
		api.createDeployment(apiParameters,
			(error, response) => {
				if(response) {
					done(error, {
						deploymentId: response.id,
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
