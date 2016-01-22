export default function publishLambdaVersionStep(conan, context, stepDone) {
	const AWS = context.libraries.AWS;
	const iam = new AWS.Lambda({
		region: conan.config.region
	});

	iam.publishVersion({
		"FunctionName": context.parameters.name(),
		"Description": "conan autopublish step"
	}, (error, responseData) => {
		if (error) {
			stepDone(error);
		} else {
			stepDone(null, {
				lambdaVersion: responseData.Version
			});
		}
	});
}
