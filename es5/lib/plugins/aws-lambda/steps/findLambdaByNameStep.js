"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = findLambdaByNameStep;
function findLambdaByNameStep(conan, context, stepDone) {
	var AWS = context.libraries.AWS;
	var lambda = new AWS.Lambda({
		region: conan.config.region
	});
	var lambdaName = undefined;
	if (typeof context.parameters.name === "function") {
		lambdaName = context.parameters.name();
	} else {
		lambdaName = context.parameters.lambda()[0];
	}

	if (lambdaName) {
		lambda.getFunction({
			"FunctionName": lambdaName
		}, function (error, responseData) {
			if (error && error.statusCode === 404) {
				stepDone(null, {
					lambdaArn: null
				});
			} else if (error) {
				stepDone(error);
			} else {
				stepDone(null, {
					lambdaArn: responseData.Configuration.FunctionArn
				});
			}
		});
	} else {
		stepDone(null, {
			lambdaArn: null
		});
	}
}