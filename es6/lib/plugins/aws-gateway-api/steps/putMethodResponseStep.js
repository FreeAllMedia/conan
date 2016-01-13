import flowsync from "flowsync";

function getResponseParameters(responseHeaders) {
	let result = {};
	Object.keys(responseHeaders).forEach(
		responseHeaderName => {
			result[`method.response.header.${responseHeaderName}`] = false;
		}
	);
	return result;
}

export default function putMethodResponseStep(conan, context, done) {
	const restApiId = context.results.restApiId;
	let resourceId = context.results.apiResourceId;
	const statusCodes = context.parameters.statusCodes();
	const responseStatusCodes = context.results.responseStatusCodes;
	if(restApiId
			&& resourceId
			&& Array.isArray(responseStatusCodes)
			&& Array.isArray(statusCodes)) {
		const api = new context.libraries.AWS.APIGateway({
			region: conan.config.region
		});

		const responseParameters = getResponseParameters(context.parameters.responseHeaders());

		flowsync.eachSeries(statusCodes, (statusCode, next) => {
				const status = responseStatusCodes.find((currentStatusCode) => {
					return currentStatusCode === `${statusCode}`;
				});
				//if the specified status is new
				if(!status) {
					const apiParameters = {
						restApiId,
						resourceId,
						httpMethod: context.parameters.method(),
						statusCode: `${statusCode}`,
						responseParameters
					};
					api.putMethodResponse(apiParameters,
						(error, response) => {
							if(response) {
								next();
							} else {
								next(error);
							}
						});
				} else {
					next();
				}
			}, (error) => {
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
