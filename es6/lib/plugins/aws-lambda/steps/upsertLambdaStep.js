import fileSystem from "fs";

export default function upsertLambdaStep(conan, context, stepDone) {
	const conanAwsLambda = context.parameters;
	const AWS = context.libraries.AWS;
	const lambda = AWS.Lambda({region: conan.config.region});

	const lambdaArn = context.results.lambdaArn;
	const lambdaIsNew = lambdaArn === undefined;

	if (lambdaIsNew) {
		lambda.createFunction(conanAwsLambda, (createFunctionError, data) => {
			if (createFunctionError) {
				throw createFunctionError;
			}
			stepDone(null, {
				lambdaArn: data.FunctionArn
			});
		});
	} else {
		const updateConfigurationParameters = {
			FunctionName: conanAwsLambda.name(),
			Handler: conanAwsLambda.handler(),
			Role: conanAwsLambda.role(),
			Description: conanAwsLambda.description(),
			MemorySize: conanAwsLambda.memorySize(),
			Timeout: conanAwsLambda.timeout()
		};
		lambda.updateFunctionConfiguration(updateConfigurationParameters, (updateConfigurationError) => {
			if (updateConfigurationError) { throw updateConfigurationError; }
			const updateCodeParameters = {
				ZipFile: fileSystem.readFileSync(context.results.lambdaZipFilePath),
				FunctionName: conanAwsLambda.name(),
				Publish: conanAwsLambda.publish()
			};
			lambda.updateFunctionCode(updateCodeParameters, (updateCodeError, data) => {
				if (updateCodeError) { throw updateCodeError; }
				stepDone(null, {
					lambdaArn: lambdaArn
				});
			});
		});
	}
}
