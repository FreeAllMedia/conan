"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = upsertLambdaByNameStep;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _awsSdk = require("aws-sdk");

var _awsSdk2 = _interopRequireDefault(_awsSdk);

// shotcut constructor to allow rewireLambdaConstructor
var LambdaConstructor = _awsSdk2["default"].Lambda;

function upsertLambdaByNameStep(conan, context, done) {
	var lambda = new LambdaConstructor({ "region": conan.config.region });
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
				result.lambda.response = response;
				lambdaParameters = {
					"FunctionName": context.parameters.name,
					"S3Bucket": context.results.s3Bucket,
					"S3Key": context.results.s3Key,
					"S3ObjectVersion": context.results.s3ObjectVersion,
					"Publish": context.parameters.publish
				};
				lambda.updateFunctionCode(lambdaParameters, function (updateCodeError, updateCodeResponse) {
					result.lambda.response.Code = updateCodeResponse;
					done(updateCodeError, result);
				});
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
				result.lambda.response = response;
				done(error, result);
			});
		})();
	}
}

module.exports = exports["default"];