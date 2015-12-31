"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = findLambdaByNameStep;

function findLambdaByNameStep(conan, context, stepDone) {
	var AWS = context.libraries.AWS;
	var lambda = AWS.Lambda({
		region: conan.config.region
	});

	lambda.getFunction({
		"FunctionName": context.parameters.name()
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
}

module.exports = exports["default"];