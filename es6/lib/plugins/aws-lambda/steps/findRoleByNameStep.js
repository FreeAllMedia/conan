export default function findRoleByNameStep(conan, context, stepDone) {
	const AWS = context.dependencies.AWS;
	const iam = new AWS.IAM({
		region: conan.config.region
	});

	iam.getRole({
		"RoleName": context.parameters.name
	}, (error, responseData) => {
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
