export default function upsertLambdaStep(conan, context, stepDone) {
	const AWS = context.dependencies.AWS;
	const lambda = AWS.Lambda({region: conan.config.region})

	const lambdaArn = context.results.lambdaArn;
	const lambdaIsNew = lambdaArn === undefined;

	if (lambdaIsNew) {
		lambda.createFunction(context.parameters, (createFunctionError, data) => {
			if (createFunctionError) {
				throw createFunctionError;
			}
			stepDone(null, {
				lambdaArn: data.FunctionArn
			});
		});
	} else {
		const updateConfigurationParameters = {
			FunctionName: context.parameters.FunctionName,
			Handler: context.parameters.Handler,
			Role: context.parameters.Role,
			Description: context.parameters.Description,
			MemorySize: context.parameters.MemorySize,
			Timeout: context.parameters.Timeout
		};
		lambda.updateFunctionConfiguration(updateConfigurationParameters, (updateConfigurationError) => {
			if (updateConfigurationError) { throw updateConfigurationError; }
			const updateCodeParameters = {
				ZipFile: context.parameters.Code.ZipFile,
				FunctionName: context.parameters.FunctionName,
				Publish: context.parameters.Publish
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
