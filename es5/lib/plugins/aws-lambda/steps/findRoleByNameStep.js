"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = findRoleByNameStep;
function findRoleByNameStep(conan, context, stepDone) {
	var AWS = context.libraries.AWS;
	var iam = new AWS.IAM({
		region: conan.config.region
	});

	iam.getRole({
		"RoleName": context.parameters.role()
	}, function (error, responseData) {
		if (error && error.statusCode === 404) {
			stepDone(null, {
				roleArn: null
			});
		} else if (error) {
			stepDone(error);
		} else {
			stepDone(null, {
				roleArn: responseData.Role.Arn
			});
		}
	});
}