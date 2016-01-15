export default function findRoleByNameStep(conan, context, stepDone) {
	const AWS = context.libraries.AWS;
	const iam = new AWS.IAM({
		region: conan.config.region
	});

	iam.getRole({
		"RoleName": context.parameters.role()
	}, (error, responseData) => {
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
