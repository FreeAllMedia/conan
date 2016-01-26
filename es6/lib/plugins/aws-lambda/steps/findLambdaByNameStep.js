export default function findLambdaByNameStep(conan, context, stepDone) {
	const AWS = context.libraries.AWS;
	const lambda = new AWS.Lambda({
		region: conan.config.region
	});
	let lambdaName;
	if(typeof context.parameters.name === "function") {
		lambdaName = context.parameters.name();
	} else {
		lambdaName = context.parameters.lambda()[0];
	}

	if(lambdaName) {
		lambda.getFunction({
			"FunctionName": lambdaName
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
	} else {
		stepDone(null, {
			lambdaArn: null
		});
	}
}
