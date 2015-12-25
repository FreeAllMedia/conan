"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = findRoleByNameStep;

function findRoleByNameStep(conan, context, stepDone) {
	var AWS = context.dependencies.AWS;
	var iam = new AWS.IAM({
		region: conan.config.region
	});

	iam.getRole({
		"RoleName": context.parameters.name
	}, function (error, responseData) {
		if (error && error.statusCode === 404) {
			stepDone(null, {
				role: {
					id: null
				}
			});
		} else if (error) {
			stepDone(error);
		} else {
			stepDone(null, {
				role: {
					id: responseData.Role.Arn
				}
			});
		}
	});
}

module.exports = exports["default"];