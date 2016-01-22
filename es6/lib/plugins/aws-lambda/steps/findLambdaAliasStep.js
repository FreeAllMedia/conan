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
			console.log("calling get aalias for " + aliasName);
			iam.getAlias({
				"FunctionName": context.parameters.lambda(),
				"Name": aliasName
			}, (error, responseData) => {
				console.log("get alias returns ", {error, responseData});
				if(responseData && responseData.FunctionVersion === aliasVersion) {
					result[aliasName] = responseData.AliasArn;
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
