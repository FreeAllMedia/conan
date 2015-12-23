"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = findLambdaByNameStep;

function findLambdaByNameStep(conan, context, done) {
	var lambda = new context.dependencies.aws.Lambda({ "region": conan.config.region });
	var lambdaParameters = { "FunctionName": context.parameters.name };
	var result = { lambda: { name: context.parameters.name } };
	lambda.getFunction(lambdaParameters, function (error, response) {
		if (error && error.statusCode === 404) {
			result.lambda.found = false;
			done(error, result);
		} else if (response) {
			result.lambda.response = response;
			result.lambda.found = true;
			done(error, result);
		} else {
			done(error);
		}
	});
}

module.exports = exports["default"];