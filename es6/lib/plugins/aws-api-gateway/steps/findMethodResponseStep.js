import flowsync from "flowsync";

export default function findMethodResponseStep(conan, context, done) {
	const restApiId = context.results.restApiId;
	const resourceId = context.results.apiResourceId;
	const statusCodes = context.parameters.statusCodes();
	const existingStatusCodes = [];
	if(restApiId
		&& resourceId
		&& statusCodes) {
			const api = new context.libraries.AWS.APIGateway({
				region: conan.config.region
			});

			flowsync.eachSeries(Object.keys(statusCodes), (statusCode, next) => {
				const apiParameters = {
					httpMethod: context.parameters.method(),
					resourceId,
					restApiId,
					statusCode: `${statusCode}`
				};
				api.getMethodResponse(apiParameters,
					(error, response) => {
						if(response) {
							existingStatusCodes.push(response.statusCode);
							next();
						} else if(error && error.statusCode === 404) {
							next();
						} else{
							next(error);
						}
					});
			}, (error) => {
				if(error) {
					done(error);
				} else {
					done(null, {
						responseStatusCodes: existingStatusCodes
					});
				}
			});
	} else {
		done();
	}
}
