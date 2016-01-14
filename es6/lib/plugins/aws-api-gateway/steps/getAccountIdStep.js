export default function getAccountIdStep(conan, context, done) {
	const api = new context.libraries.AWS.IAM({
		region: conan.config.region
	});
	const apiParameters = {};
	api.getUser(apiParameters,
		(error, response) => {
			if(response && response.User && response.User.Arn) {
				const arnTokens = response.User.Arn.split(":");
				done(null, {
					accountId: arnTokens[4]
				});
			} else {
				done(error);
			}
		});
}
