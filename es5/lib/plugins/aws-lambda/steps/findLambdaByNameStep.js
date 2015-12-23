"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = findLambdaByNameStep;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _awsSdk = require("aws-sdk");

var _awsSdk2 = _interopRequireDefault(_awsSdk);

// shotcut constructor to allow rewireLambdaConstructor
var LambdaConstructor = _awsSdk2["default"].Lambda;

function findLambdaByNameStep(conan, context, done) {
	var lambda = new LambdaConstructor({ "region": conan.config.region });
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