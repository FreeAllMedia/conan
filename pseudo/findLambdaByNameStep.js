export default function findLambdaByNameStep(conan, context, done) {
	const lambda = new context.dependencies.aws.Lambda({"region": conan.config.region});
	const lambdaParameters = { "FunctionName": context.parameters.name };
	const result = { lambda: { name: context.parameters.name } };
	lambda.getFunction(lambdaParameters,
		(error, response) => {
			if(error && error.statusCode === 404) {
				result.lambda.found = false;
				done(error, result);
			} else if(response) {
				result.lambda.response = response;
				result.lambda.found = true;
				done(error, result);
			} else {
				done(error);
			}
		});
}
