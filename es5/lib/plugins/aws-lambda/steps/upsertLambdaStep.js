"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = upsertLambdaStep;

function upsertLambdaStep(conan, context, stepDone) {
	var AWS = context.dependencies.AWS;
	var lambda = AWS.Lambda({ region: conan.config.region });

	var lambdaArn = context.results.lambdaArn;
	var lambdaIsNew = lambdaArn === undefined;

	if (lambdaIsNew) {
		lambda.createFunction(context.parameters, function (createFunctionError, data) {
			if (createFunctionError) {
				throw createFunctionError;
			}
			stepDone(null, {
				lambdaArn: data.FunctionArn
			});
		});
	} else {
		var updateConfigurationParameters = {
			FunctionName: context.parameters.FunctionName,
			Handler: context.parameters.Handler,
			Role: context.parameters.Role,
			Description: context.parameters.Description,
			MemorySize: context.parameters.MemorySize,
			Timeout: context.parameters.Timeout
		};
		lambda.updateFunctionConfiguration(updateConfigurationParameters, function (updateConfigurationError) {
			if (updateConfigurationError) {
				throw updateConfigurationError;
			}
			var updateCodeParameters = {
				ZipFile: context.parameters.Code.ZipFile,
				FunctionName: context.parameters.FunctionName,
				Publish: context.parameters.Publish
			};
			lambda.updateFunctionCode(updateCodeParameters, function (updateCodeError, data) {
				if (updateCodeError) {
					throw updateCodeError;
				}
				stepDone(null, {
					lambdaArn: lambdaArn
				});
			});
		});
	}
}

module.exports = exports["default"];