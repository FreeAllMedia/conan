"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = putIntegrationResponseStep;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _flowsync = require("flowsync");

var _flowsync2 = _interopRequireDefault(_flowsync);

// HACK: parametrize napping template
var responseTemplates = { "application/json": "" };

function putIntegrationResponseStep(conan, context, done) {
	var restApiId = context.results.restApiId;
	var resourceId = context.results.apiResourceId;
	var statusCodes = context.parameters.statusCodes();
	if (restApiId && resourceId && Array.isArray(statusCodes)) {
		(function () {
			var api = new context.libraries.AWS.APIGateway({
				region: conan.config.region
			});

			_flowsync2["default"].eachSeries(statusCodes, function (statusCode, next) {
				var apiParameters = {
					restApiId: restApiId,
					resourceId: resourceId,
					httpMethod: context.parameters.method(),
					selectionPattern: "",
					responseTemplates: responseTemplates,
					statusCode: "" + statusCode
				};
				api.putIntegrationResponse(apiParameters, function (error, response) {
					if (response) {
						next();
					} else {
						next(error);
					}
				});
			}, function (error) {
				if (error) {
					done(error);
				} else {
					done(null, {});
				}
			});
		})();
	} else {
		done(null, {});
	}
}

module.exports = exports["default"];