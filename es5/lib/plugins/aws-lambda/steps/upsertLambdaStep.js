"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = upsertLambdaStep;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function upsertLambdaStep(conan, context, stepDone) {
	var conanAwsLambda = context.parameters;
	var AWS = context.dependencies.AWS;
	var lambda = AWS.Lambda({ region: conan.config.region });

	var lambdaArn = context.results.lambdaArn;
	var lambdaIsNew = lambdaArn === undefined;

	if (lambdaIsNew) {
		lambda.createFunction(conanAwsLambda, function (createFunctionError, data) {
			if (createFunctionError) {
				throw createFunctionError;
			}
			stepDone(null, {
				lambdaArn: data.FunctionArn
			});
		});
	} else {
		var updateConfigurationParameters = {
			FunctionName: conanAwsLambda.name(),
			Handler: conanAwsLambda.handler(),
			Role: conanAwsLambda.role(),
			Description: conanAwsLambda.description(),
			MemorySize: conanAwsLambda.memorySize(),
			Timeout: conanAwsLambda.timeout()
		};
		lambda.updateFunctionConfiguration(updateConfigurationParameters, function (updateConfigurationError) {
			if (updateConfigurationError) {
				throw updateConfigurationError;
			}
			var updateCodeParameters = {
				ZipFile: _fs2["default"].readFileSync(context.results.lambdaZipFilePath),
				FunctionName: conanAwsLambda.name(),
				Publish: conanAwsLambda.publish()
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