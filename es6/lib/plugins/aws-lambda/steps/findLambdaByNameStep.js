export default function findLambdaByNameStep(conan, context, stepDone) {
	const AWS = context.dependencies.AWS;
	const lambda = new AWS.Lambda({
		region: conan.config.region
	});

	lambda.getFunction({
		"FunctionName": context.parameters.name
	}, (error, responseData) => {
		if (error && error.statusCode === 404) {
			stepDone(null, {
				lambdaArn: null
			});
		} else if (error) {
			stepDone(error);
		} else {
			stepDone(null, {
				lambdaArn: responseData.Configuration.FunctionArn
			});
		}
	});
}
