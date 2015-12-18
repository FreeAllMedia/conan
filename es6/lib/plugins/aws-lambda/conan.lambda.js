import privateData from "incognito";

export default class ConanAwsLambda {
	constructor (conan) {
		privateData(this).conan = conan;

		// conan.lambda = this;
	}
}
