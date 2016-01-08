"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = upsertLambdaStep;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function upsertLambdaStep(conan, context, stepDone) {
	var conanAwsLambda = context.parameters;
	var AWS = context.libraries.AWS;
	var lambda = new AWS.Lambda({ region: conan.config.region });

	var lambdaArn = context.results.lambdaArn;
	var roleArn = context.results.roleArn;

	var lambdaIsNew = lambdaArn === null;

	var lambdaZipBuffer = _fs2["default"].readFileSync(context.results.lambdaZipFilePath);

	var fileName = _path2["default"].parse(conanAwsLambda.filePath()).name;
	var handlerString = fileName + "." + conanAwsLambda.handler();

	if (lambdaIsNew) {
		var createFunctionParameters = {
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

		lambda.createFunction(createFunctionParameters, function (createFunctionError, data) {
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
			Handler: handlerString,
			Role: roleArn,
			Description: conanAwsLambda.description(),
			MemorySize: conanAwsLambda.memorySize(),
			Timeout: conanAwsLambda.timeout()
		};
		lambda.updateFunctionConfiguration(updateConfigurationParameters, function (updateConfigurationError) {
			if (updateConfigurationError) {
				throw updateConfigurationError;
			}
			var updateCodeParameters = {
				ZipFile: lambdaZipBuffer,
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