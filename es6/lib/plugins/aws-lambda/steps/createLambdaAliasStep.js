import flowsync from "flowsync";

export default function createLambdaAliasStep(conan, context, stepDone) {
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

			let aliasExists;
			if(context.results.aliases) {
				aliasExists = context.results.aliases[aliasName];
			}

			if(!aliasExists) {
				iam.createAlias({
					"FunctionName": context.parameters.name(),
					"FunctionVersion": aliasVersion,
					"Name": aliasName,
					"Description": "conan auto created alias"
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
