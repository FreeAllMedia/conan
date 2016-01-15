import flowsync from "flowsync";

// HACK: parametrize napping template
const responseTemplates = {"application/json": ""};

export default function putIntegrationResponseStep(conan, context, done) {
	const restApiId = context.results.restApiId;
	let resourceId = context.results.apiResourceId;
	const statusCodes = context.parameters.statusCodes();
	if(restApiId
			&& resourceId
			&& Array.isArray(statusCodes)) {
		const api = new context.libraries.AWS.APIGateway({
			region: conan.config.region
		});

		flowsync.eachSeries(statusCodes,
			(statusCode, next) => {
				const apiParameters = {
					restApiId,
					resourceId,
					httpMethod: context.parameters.method(),
					selectionPattern: "",
					responseTemplates,
					statusCode: `${statusCode}`
				};
				api.putIntegrationResponse(apiParameters,
					(error, response) => {
						if(response) {
							next();
						} else {
							next(error);
						}
					});
			},
			(error) => {
				if(error) {
					done(error);
				} else {
					done(null, {});
				}
			});
	} else {
		done(null, { });
	}
}
