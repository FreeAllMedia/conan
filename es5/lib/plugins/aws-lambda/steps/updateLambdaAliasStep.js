"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = updateLambdaAliasStep;

var _flowsync = require("flowsync");

var _flowsync2 = _interopRequireDefault(_flowsync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function updateLambdaAliasStep(conan, context, stepDone) {
	var AWS = context.libraries.AWS;
	var iam = new AWS.Lambda({
		region: conan.config.region
	});

	var aliases = context.parameters.alias();
	var result = context.results.aliases;
	_flowsync2.default.eachSeries(aliases, function (alias, next) {
		var aliasName = alias[0];
		var aliasVersion = undefined;
		if (alias.length > 1) {
			aliasVersion = alias[1];
		} else {
			aliasVersion = "$LATEST";
		}

		if (context.results.aliases && context.results.aliases[aliasName] && !context.results.aliases[aliasName].functionVersion) {
			iam.updateAlias({
				"FunctionName": context.parameters.name(),
				"FunctionVersion": aliasVersion,
				"Name": aliasName,
				"Description": "conan auto updated alias"
			}, function (error, responseData) {
				if (responseData) {
					result[aliasName] = {
						aliasArn: responseData.AliasArn,
						functionVersion: responseData.FunctionVersion
					};
					next();
				} else {
					next(error);
				}
			});
		} else {
			next();
		}
	}, function (error) {
		stepDone(error, { aliases: result });
	});
}