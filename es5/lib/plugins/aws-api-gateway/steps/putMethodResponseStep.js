"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = putMethodResponseStep;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _flowsync = require("flowsync");

var _flowsync2 = _interopRequireDefault(_flowsync);

function putMethodResponseStep(conan, context, done) {
	var restApiId = context.results.restApiId;
	var resourceId = context.results.apiResourceId;
	var statusCodes = context.parameters.statusCodes();
	var responseStatusCodes = context.results.responseStatusCodes;
	if (restApiId && resourceId && Array.isArray(responseStatusCodes) && Array.isArray(statusCodes)) {
		(function () {
			var api = new context.libraries.AWS.APIGateway({
				region: conan.config.region
			});
			// TODO: iterate async through param statuses
			_flowsync2["default"].eachSeries(statusCodes, function (statusCode, next) {
				var status = responseStatusCodes.find(function (currentStatusCode) {
					return currentStatusCode === "" + statusCode;
				});
				//if the specified status is new
				if (!status) {
					var apiParameters = {
						restApiId: restApiId,
						resourceId: resourceId,
						httpMethod: context.parameters.method(),
						statusCode: "" + statusCode,
						responseParameters: {}
					};
					api.putMethodResponse(apiParameters, function (error, response) {
						if (response) {
							next();
						} else {
							next(error);
						}
					});
				} else {
					next();
				}
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