"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = publishLambdaVersionStep;
function publishLambdaVersionStep(conan, context, stepDone) {
	var AWS = context.libraries.AWS;
	var iam = new AWS.Lambda({
		region: conan.config.region
	});

	iam.publishVersion({
		"FunctionName": context.parameters.name(),
		"Description": "conan autopublish step"
	}, function (error, responseData) {
		if (error) {
			stepDone(error);
		} else {
			stepDone(null, {
				lambdaVersion: responseData.Version
			});
		}
	});
}