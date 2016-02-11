"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = getAccountIdStep;
function getAccountIdStep(conan, context, done) {
	var api = new context.libraries.AWS.IAM({
		region: conan.config.region
	});
	var apiParameters = {};
	api.getUser(apiParameters, function (error, response) {
		if (response && response.User && response.User.Arn) {
			var arnTokens = response.User.Arn.split(":");
			done(null, {
				accountId: arnTokens[4]
			});
		} else {
			done(error);
		}
	});
}