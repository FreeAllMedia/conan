import flowsync from "flowsync";

export default function findLambdaAliasStep(conan, context, stepDone) {
	const AWS = context.libraries.AWS;
	const iam = new AWS.Lambda({
		region: conan.config.region
	});

	const aliases = context.parameters.alias();
	const result = { };
	flowsync.eachSeries(aliases,
		(alias, next) => {
			const aliasName = alias[0];
			let aliasVersion;
			if(alias.length > 1) {
				aliasVersion = alias[1];
			} else {
				aliasVersion = "$LATEST";
			}

			iam.getAlias({
				"FunctionName": context.parameters.name(),
				"Name": aliasName
			}, (error, responseData) => {
				if(responseData && responseData.FunctionVersion === aliasVersion) {
					// alias exists
					result[aliasName] = {
						aliasArn: responseData.AliasArn,
						functionVersion: responseData.FunctionVersion
					};
					next();
				} else if(responseData && responseData.FunctionVersion) {
					// needs version update
					result[aliasName] = {
						aliasArn: responseData.AliasArn
					};
					next();
				} else if(error && error.statusCode === 404) {
					next();
				} else {
					next(error);
				}
			});
		},
		(error) => {
			stepDone(error, { aliases: result });
		});
}
