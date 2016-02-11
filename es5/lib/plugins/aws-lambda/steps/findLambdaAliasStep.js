"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = findLambdaAliasStep;

var _flowsync = require("flowsync");

var _flowsync2 = _interopRequireDefault(_flowsync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function findLambdaAliasStep(conan, context, stepDone) {
	var AWS = context.libraries.AWS;
	var iam = new AWS.Lambda({
		region: conan.config.region
	});

	var aliases = context.parameters.alias();
	var result = {};
	_flowsync2.default.eachSeries(aliases, function (alias, next) {
		var aliasName = alias[0];
		var aliasVersion = undefined;
		if (alias.length > 1) {
			aliasVersion = alias[1];
		} else {
			aliasVersion = "$LATEST";
		}

		iam.getAlias({
			"FunctionName": context.parameters.name(),
			"Name": aliasName
		}, function (error, responseData) {
			if (responseData && responseData.FunctionVersion === aliasVersion) {
				// alias exists
				result[aliasName] = {
					aliasArn: responseData.AliasArn,
					functionVersion: responseData.FunctionVersion
				};
				next();
			} else if (responseData && responseData.FunctionVersion) {
				// needs version update
				result[aliasName] = {
					aliasArn: responseData.AliasArn
				};
				next();
			} else if (error && error.statusCode === 404) {
				next();
			} else {
				next(error);
			}
		});
	}, function (error) {
		stepDone(error, { aliases: result });
	});
}