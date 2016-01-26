import flowsync from "flowsync";

export default function updateLambdaAliasStep(conan, context, stepDone) {
	const AWS = context.libraries.AWS;
	const iam = new AWS.Lambda({
		region: conan.config.region
	});

	const aliases = context.parameters.alias();
	const result = context.results.aliases;
	flowsync.eachSeries(aliases,
		(alias, next) => {
			const aliasName = alias[0];
			let aliasVersion;
			if(alias.length > 1) {
				aliasVersion = alias[1];
			} else {
				aliasVersion = "$LATEST";
			}

			if(context.results.aliases
				&& context.results.aliases[aliasName]
				&& !context.results.aliases[aliasName].functionVersion) {
				iam.updateAlias({
					"FunctionName": context.parameters.name(),
					"FunctionVersion": aliasVersion,
					"Name": aliasName,
					"Description": "conan auto updated alias"
				}, (error, responseData) => {
					if(responseData) {
						result[aliasName] = {
							aliasArn: responseData.AliasArn,
							functionVersion: responseData.FunctionVersion
						};
						next();
					} else {
						next(error);
					}
				});
			} else {
				next();
			}
		},
		(error) => {
			stepDone(error, { aliases: result });
		});
}
