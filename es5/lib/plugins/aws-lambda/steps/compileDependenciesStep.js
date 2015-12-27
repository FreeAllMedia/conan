"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = compileDependenciesStep;

function compileDependenciesStep(conan, context, stepDone) {
	var AWS = context.dependencies.AWS;

	var lambda = new AWS.Lambda({
		region: conan.config.region
	});

	var s3 = new AWS.S3({
		region: conan.config.region
	});

	var parameters = {
		FunctionName: "Thaumaturgy",
		InvocationType: "RequestResponse",
		LogType: "Tail",
		Payload: JSON.stringify(context.parameters)
	};

	lambda.invoke(parameters, function (error, data) {
		var dependencyZipStream = s3.getObject({
			Bucket: context.parameters.bucket,
			Key: context.parameters.key
		});

		stepDone(null, {
			dependencyZipStream: dependencyZipStream
		});
	});
}

module.exports = exports["default"];