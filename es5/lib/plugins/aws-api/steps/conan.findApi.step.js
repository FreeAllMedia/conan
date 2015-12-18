"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = conanFindApiStep;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _awsSdk = require("aws-sdk");

var _awsSdk2 = _interopRequireDefault(_awsSdk);

// shotcut constructor to allow rewire
var ApiGateWayConstructor = _awsSdk2["default"].APIGateway;

function conanFindApiStep(conanContext, finishStep) {
	var apiGateway = new ApiGateWayConstructor({ region: conanContext.config("region") });
	// need to find if the api is new
	apiGateway.getRestApis({}, function (error, response) {
		if (response && response.items && Array.isArray(response.items)) {
			var found = response.items.find(function (restApi) {
				return restApi.name === conanContext.stepBuilder.name;
			});
			finishStep(error, found);
		} else {
			finishStep(error);
		}
	});
}

module.exports = exports["default"];