"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = createRoleStep;
function createRoleStep(conan, context, stepDone) {
	if (!context.results.roleArn) {
		var AWS = context.libraries.AWS;
		var iam = new AWS.IAM({
			region: conan.config.region
		});

		iam.createRole({
			"RoleName": context.parameters.role(),
			"AssumeRolePolicyDocument": JSON.stringify({
				"Version": "2012-10-17",
				"Statement": {
					"Effect": "Allow",
					"Action": "sts:AssumeRole",
					"Principal": {
						"Service": "lambda.amazonaws.com"
					}
				}
			})
		}, function (error, responseData) {
			if (error) {
				stepDone(error);
			} else {
				stepDone(null, {
					roleArn: responseData.Role.Arn
				});
			}
		});
	} else {
		stepDone();
	}
}