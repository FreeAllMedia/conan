"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = findMethodResponseStep;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _flowsync = require("flowsync");

var _flowsync2 = _interopRequireDefault(_flowsync);

function findMethodResponseStep(conan, context, done) {
	var restApiId = context.results.restApiId;
	var resourceId = context.results.apiResourceId;
	var statusCodes = context.parameters.statusCodes();
	var existingStatusCodes = [];
	if (restApiId && resourceId && Array.isArray(statusCodes)) {
		(function () {
			var api = new context.libraries.AWS.APIGateway({
				region: conan.config.region
			});

			_flowsync2["default"].eachSeries(statusCodes, function (statusCode, next) {
				var apiParameters = {
					httpMethod: context.parameters.method(),
					resourceId: resourceId,
					restApiId: restApiId,
					statusCode: "" + statusCode
				};
				api.getMethodResponse(apiParameters, function (error, response) {
					if (response) {
						existingStatusCodes.push(response.statusCode);
						next();
					} else if (error && error.statusCode === 404) {
						next();
					} else {
						next(error);
					}
				});
			}, function (error) {
				if (error) {
					done(error);
				} else {
					done(null, {
						responseStatusCodes: existingStatusCodes
					});
				}
			});
		})();
	} else {
		done();
	}
}

module.exports = exports["default"];