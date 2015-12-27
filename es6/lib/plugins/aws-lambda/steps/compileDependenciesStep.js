export default function compileDependenciesStep(conan, context, stepDone) {
	const AWS = context.dependencies.AWS;

	const lambda = new AWS.Lambda({
		region: conan.config.region
	});

	const s3 = new AWS.S3({
		region: conan.config.region
	});

	const parameters = {
		FunctionName: "Thaumaturgy",
		InvocationType: "RequestResponse",
		LogType: "Tail",
		Payload: JSON.stringify(context.parameters)
	};

	lambda.invoke(parameters, (error, data) => {
		const dependencyZipStream = s3.getObject({
			Bucket: context.parameters.bucket,
			Key: context.parameters.key,
		});

		stepDone(null, {
			dependencyZipStream: dependencyZipStream
		});
	});
}
