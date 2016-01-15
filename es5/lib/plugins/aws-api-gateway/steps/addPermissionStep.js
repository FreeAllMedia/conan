import hacher from "hacher";

export default function addPermissionStep(conan, context, stepDone) {
	const AWS = context.libraries.AWS;
	const region = conan.config.region;
	const accountId = context.results.accountId;
	const restApiId = context.results.restApiId;
	const lambda = new AWS.Lambda({
		region
	});
	if(typeof context.parameters.lambda === "function"
		&& typeof context.parameters.method === "function"
		&& typeof context.parameters.path === "function"
		&& accountId
		&& restApiId) {
		const lambdaName = context.parameters.lambda();
		lambda.getPolicy({
			"FunctionName": lambdaName
		}, (getPolicyError, response) => {
			let statement;
			const method = context.parameters.method();
			const path = context.parameters.path();
			const sourceArn = `arn:aws:execute-api:${region}:${accountId}:${restApiId}/*/${method}${path}`;
			if(response && response.Policy) {
				try {
					const policy = JSON.parse(response.Policy);
					statement = policy.Statement.find(currentStatement => {
						if(!currentStatement.Condition || !currentStatement.Condition.ArnLike) {
							return false;
						} else {
							return currentStatement.Condition.ArnLike["AWS:SourceArn"] === sourceArn;
						}
					});
				} catch(e) {
					statement = null;
				}
			}
			if(!statement) {
				lambda.addPermission({
					"FunctionName": lambdaName,
					"SourceArn": sourceArn,
					"Action": "lambda:InvokeFunction",
					"Principal": "apigateway.amazonaws.com",
					"StatementId": hacher.getUUID()
				}, (error) => {
					if (error && error.statusCode === 409) {
						stepDone(null);
					} else if (error) {
						stepDone(error);
					} else {
						stepDone(null);
					}
				});
			} else {
				stepDone();
			}
		});
	} else {
		stepDone();
	}
}
