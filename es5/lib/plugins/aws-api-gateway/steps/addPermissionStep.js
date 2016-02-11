"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = addPermissionStep;

var _hacher = require("hacher");

var _hacher2 = _interopRequireDefault(_hacher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addPermissionStep(conan, context, stepDone) {
	var AWS = context.libraries.AWS;
	var region = conan.config.region;
	var accountId = context.results.accountId;
	var restApiId = context.results.restApiId;
	var lambda = new AWS.Lambda({
		region: region
	});
	if (typeof context.parameters.lambda === "function" && typeof context.parameters.method === "function" && typeof context.parameters.path === "function" && accountId && restApiId) {
		(function () {
			var lambdaName = context.parameters.lambda()[0];
			var method = context.parameters.method();
			var path = context.parameters.path();
			if (lambdaName) {
				lambda.getPolicy({
					"FunctionName": lambdaName
				}, function (getPolicyError, response) {
					var statement = undefined;
					var sourceArn = "arn:aws:execute-api:" + region + ":" + accountId + ":" + restApiId + "/*/" + method + path;
					if (response && response.Policy) {
						try {
							var policy = JSON.parse(response.Policy);
							statement = policy.Statement.find(function (currentStatement) {
								if (!currentStatement.Condition || !currentStatement.Condition.ArnLike) {
									return false;
								} else {
									return currentStatement.Condition.ArnLike["AWS:SourceArn"] === sourceArn;
								}
							});
						} catch (e) {
							statement = null;
						}
					}
					if (!statement) {
						var apiParameters = {
							"FunctionName": lambdaName,
							"SourceArn": sourceArn,
							"Action": "lambda:InvokeFunction",
							"Principal": "apigateway.amazonaws.com",
							"StatementId": _hacher2.default.getUUID()
						};
						if (context.parameters.lambda().length > 1) {
							apiParameters.Qualifier = context.parameters.lambda()[1];
						}
						lambda.addPermission(apiParameters, function (error) {
							if (error && error.statusCode === 409) {
								stepDone(null);
							} else if (error) {
								stepDone(error);
							} else {
								stepDone(null);
							}
						});
					} else {
						stepDone();
					}
				});
			} else {
				stepDone();
			}
		})();
	} else {
		stepDone();
	}
}