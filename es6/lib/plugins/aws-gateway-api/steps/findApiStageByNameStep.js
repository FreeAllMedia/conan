export default function findApiStageByNameStep(conan, context, done) {
	const api = new context.libraries.AWS.APIGateway({
		region: conan.config.region
	});
	const apiParameters = {
		restApiId: context.results.restApiId,
		stageName: context.parameters.name()
	};
	api.getStage(apiParameters,
		(error, response) => {
			if(response) {
				done(null, {
					stageName: response.stageName
				});
			} else if(error && error.statusCode === 404) {
				done();
			} else{
				done(error);
			}
		});
}
