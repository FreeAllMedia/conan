export default function attachRolePolicyStep(conan, context, stepDone) {
	const AWS = context.libraries.AWS;
	const iam = new AWS.IAM({
		region: conan.config.region
	});

	iam.attachRolePolicy({
		"RoleName": context.parameters.role(),
		"PolicyArn": "arn:aws:iam::aws:policy/AWSLambdaExecute"
	}, (error) => {
		if (error) {
			stepDone(error);
		} else {
			stepDone();
		}
	});
}
