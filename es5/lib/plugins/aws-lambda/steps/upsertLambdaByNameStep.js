"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = upsertLambdaByNameStep;

function upsertLambdaByNameStep(conan, context, done) {
	var lambda = new context.dependencies.aws.Lambda({ "region": conan.config.region });
	if (context.results.lambda && context.results.lambda.found === true) {
		(function () {
			var lambdaParameters = {
				"FunctionName": context.parameters.name,
				"Description": context.parameters.description,
				"Handler": context.parameters.handler,
				"MemorySize": context.parameters.memorySize,
				"Role": context.parameters.role,
				"Timeout": context.parameters.timeout
			};
			var result = { lambda: { name: context.parameters.name } };
			lambda.updateFunctionConfiguration(lambdaParameters, function (error, response) {
				if (!error && response) {
					result.lambda.response = response;
					lambdaParameters = {
						"FunctionName": context.parameters.name,
						"S3Bucket": context.results.s3Bucket,
						"S3Key": context.results.s3Key,
						"S3ObjectVersion": context.results.s3ObjectVersion,
						"Publish": context.parameters.publish
					};
					lambda.updateFunctionCode(lambdaParameters, function (updateCodeError, updateCodeResponse) {
						if (!updateCodeError && updateCodeResponse) {
							result.lambda.response.Code = updateCodeResponse;
							done(null, result);
						} else {
							done(updateCodeError);
						}
					});
				} else {
					done(error);
				}
			});
		})();
	} else {
		(function () {
			var lambdaParameters = {
				"Code": {
					"S3Bucket": context.results.s3Bucket,
					"S3Key": context.results.s3Key,
					"S3ObjectVersion": context.results.s3ObjectVersion
				},
				"FunctionName": context.parameters.name,
				"Description": context.parameters.description,
				"Handler": context.parameters.handler,
				"MemorySize": context.parameters.memorySize,
				"Publish": context.parameters.publish,
				"Role": context.parameters.role,
				"Runtime": context.parameters.runtime,
				"Timeout": context.parameters.timeout
			};
			var result = { lambda: { name: context.parameters.name } };
			lambda.createFunction(lambdaParameters, function (error, response) {
				if (!error && response) {
					result.lambda.response = response;
					done(null, result);
				} else {
					done(error);
				}
			});
		})();
	}
}

module.exports = exports["default"];