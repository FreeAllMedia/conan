export default class ConanAwsApi {
	constructor(conan, name) {
		conan.steps.add(findApiStep, {
			apiName: name
		});

		conan.steps.add(findStageStep, {
			apiName: name,
			stageName: name
		});
	}
}
