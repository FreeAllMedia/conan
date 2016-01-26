"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = putIntegrationStep;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _jargon = require("jargon");

var _jargon2 = _interopRequireDefault(_jargon);

function getVelocityMap(parameterArray) {
	var result = [];
	parameterArray.forEach(function (headerName) {
		// TODO: add this requirements to jargon itself
		var curatedHeaderName = (0, _jargon2["default"])(headerName).camel.toString().replace(/-|{|}/g, "");
		var curatedBrackets = headerName.replace(/\{|}/g, "");
		result.push("\n\"" + curatedHeaderName + "\": \"$input.params('" + curatedBrackets + "')\"");
	});
	return result.join(",");
}

function putIntegrationStep(conan, context, done) {
	var restApiId = context.results.restApiId;
	var resourceId = context.results.apiResourceId;
	var lambdaArn = context.results.lambdaArn;
	if (restApiId && resourceId) {
		var api = new context.libraries.AWS.APIGateway({
			region: conan.config.region
		});
		var headerMapValues = getVelocityMap(context.parameters.headers());
		var headerMap = "\"header\": {" + headerMapValues + "\n}";
		var queryStringMapValues = getVelocityMap(context.parameters.queryStrings());
		var queryStringMap = "\"queryString\": {" + queryStringMapValues + "\n}";
		var pathTokens = context.parameters.path().split("/");
		var pathParameters = pathTokens.filter(function (pathToken) {
			return pathToken.match(/{[a-zA-Z0-9]*}/);
		});
		var pathMapValues = getVelocityMap(pathParameters);
		var pathMap = "\"path\": {" + pathMapValues + "\n}";
		var paramsSection = "\"params\": {\n " + headerMap + ",\n " + queryStringMap + ",\n " + pathMap + "},";
		var requestTemplates = { "application/json": "{\n  " + paramsSection + "\n \"data\": $input.json('$')\n}" };
		var apiParameters = {
			restApiId: restApiId,
			resourceId: resourceId,
			type: "MOCK",
			httpMethod: context.parameters.method(),
			integrationHttpMethod: "POST",
			requestTemplates: { "application/json": "{\"statusCode\": 200}" }
		};

		if (lambdaArn) {
			var aliasSuffix = "";
			if (context.parameters.lambda().length > 1) {
				aliasSuffix = ":" + context.parameters.lambda()[1];
			}
			apiParameters.type = "AWS";
			apiParameters.uri = "arn:aws:apigateway:" + conan.config.region + ":lambda:path/2015-03-31/functions/" + lambdaArn + aliasSuffix + "/invocations";
			apiParameters.requestTemplates = requestTemplates;
		}

		api.putIntegration(apiParameters, function (error, response) {
			if (response) {
				done(null, {});
			} else {
				done(error);
			}
		});
	} else {
		done(null, {});
	}
}

module.exports = exports["default"];