export default function findApiByNameStep(conan, context, done) {
	const api = new context.libraries.AWS.APIGateway({
		region: conan.config.region
	});
	const apiParameters = {};
	api.getRestApis(apiParameters,
		(error, response) => {
			if(error && error.statusCode >= 300) {
				done(error);
			} else if(response) {
				const item = response.items.find(
					(currentItem) => {
						return (currentItem.name === context.parameters.name());
					}
				);
				if(item) {
					done(null, {
						restApiId: item.id
					});
				} else {
					done();
				}
			} else {
				done();
			}
		});
}
