import fileSystem from "fs";
import path from "path";

export default function upsertLambdaStep(conan, context, stepDone) {
	const conanAwsLambda = context.parameters;
	const AWS = context.libraries.AWS;
	const lambda = new AWS.Lambda({region: conan.config.region});

	const lambdaArn = context.results.lambdaArn;
	const roleArn = context.results.roleArn;

	const lambdaIsNew = lambdaArn === null;

	const lambdaZipBuffer = fileSystem.readFileSync(context.results.lambdaZipFilePath);

	const lambdaExtension = path.extname(conanAwsLambda.filePath());
	const fileName = path.basename(conanAwsLambda.filePath(), lambdaExtension);

	const handlerName = conanAwsLambda.handler()[0];
	const handlerString = `${fileName}.${handlerName}`;

	if (lambdaIsNew) {
		const createFunctionParameters = {
			FunctionName: conanAwsLambda.name(),
			Handler: handlerString,
			Role: roleArn,
			Description: conanAwsLambda.description(),
			MemorySize: conanAwsLambda.memorySize(),
			Timeout: conanAwsLambda.timeout(),
			Runtime: conanAwsLambda.runtime(),
			Code: {
				ZipFile: lambdaZipBuffer
			}
		};

		lambda.createFunction(createFunctionParameters, (createFunctionError, data) => {
			if (createFunctionError) {
				stepDone(createFunctionError);
			} else {
				stepDone(null, {
					lambdaArn: data.FunctionArn
				});
			}
		});
	} else {
		const updateConfigurationParameters = {
			FunctionName: conanAwsLambda.name(),
			Handler: handlerString,
			Role: roleArn,
			Description: conanAwsLambda.description(),
			MemorySize: conanAwsLambda.memorySize(),
			Timeout: conanAwsLambda.timeout()
		};
		lambda.updateFunctionConfiguration(updateConfigurationParameters, (updateConfigurationError) => {
			if (updateConfigurationError) {
				stepDone(updateConfigurationError);
			} else {
				const updateCodeParameters = {
					ZipFile: lambdaZipBuffer,
					FunctionName: conanAwsLambda.name(),
					Publish: conanAwsLambda.publish()
				};
				lambda.updateFunctionCode(updateCodeParameters, (updateCodeError) => {
					if (updateCodeError) {
						stepDone(updateCodeError);
					} else {
						stepDone(null, {
							lambdaArn: lambdaArn
						});
					}
				});
			}
		});
	}
}
