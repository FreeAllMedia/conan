"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = attachRolePolicyStep;
function attachRolePolicyStep(conan, context, stepDone) {
	var AWS = context.libraries.AWS;
	var iam = new AWS.IAM({
		region: conan.config.region
	});

	iam.attachRolePolicy({
		"RoleName": context.parameters.role(),
		"PolicyArn": "arn:aws:iam::aws:policy/AWSLambdaExecute"
	}, function (error) {
		if (error) {
			stepDone(error);
		} else {
			stepDone();
		}
	});
}