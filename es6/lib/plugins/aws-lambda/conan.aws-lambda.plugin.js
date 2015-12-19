import privateData from "incognito";

export default class ConanAwsLambdaPlugin {
	constructor (conan) {
		privateData(this).conan = conan;

		conan.lambda = this.newLambda;
	}

	newLambda() {
		
	}
}
