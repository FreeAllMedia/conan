// HACK: parametrize and fix this
const requestTemplates = {"application/json": "{\n  \"params\": {\n      \"header\": {\n          \"accessToken\": \"$input.params(\"Access-Token\")\"\n      }\n  },\n  \"data\": {}\n}"};

export default function putIntegrationStep(conan, context, done) {
	const restApiId = context.results.restApiId;
	let resourceId = context.results.apiResourceId;
	const lambdaArn = context.results.lambdaArn;
	if(restApiId
			&& resourceId
			&& lambdaArn) {
		const api = new context.libraries.AWS.APIGateway({
			region: conan.config.region
		});

		const uri = `arn:aws:apigateway:${conan.config.region}:lambda:path/2015-03-31/functions/${lambdaArn}/invocations`;

		const apiParameters = {
			restApiId,
			resourceId,
			type: "AWS",
			uri,
			httpMethod: context.parameters.method(),
			integrationHttpMethod: "POST",
			requestTemplates
		};
		api.putIntegration(apiParameters,
			(error, response) => {
				if(response) {
					done(null, {});
				} else {
					done(error);
				}
			});
	} else {
		done(null, { });
	}
}
