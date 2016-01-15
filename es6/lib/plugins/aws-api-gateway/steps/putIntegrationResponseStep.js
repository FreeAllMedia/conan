import flowsync from "flowsync";

const responseTemplates = {"application/json": ""};

function getResponseParameters(responseHeaders) {
	let result = {};
	Object.keys(responseHeaders).forEach(
		responseHeaderName => {
			result[`method.response.header.${responseHeaderName}`] = `'${responseHeaders[responseHeaderName]}'`;
		}
	);
	return result;
}

export default function putIntegrationResponseStep(conan, context, done) {
	const restApiId = context.results.restApiId;
	let resourceId = context.results.apiResourceId;
	const statusCodes = context.parameters.statusCodes();
	if(restApiId
			&& resourceId
			&& statusCodes) {
		const api = new context.libraries.AWS.APIGateway({
			region: conan.config.region
		});

		const responseParameters = getResponseParameters(context.parameters.responseHeaders());

		flowsync.eachSeries(Object.keys(statusCodes),
			(statusCode, next) => {
				const apiParameters = {
					restApiId,
					resourceId,
					httpMethod: context.parameters.method(),
					selectionPattern: statusCodes[statusCode],
					responseTemplates,
					responseParameters,
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
