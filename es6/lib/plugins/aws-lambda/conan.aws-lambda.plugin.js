import ConanAwsLambda from "./components/conanAwsLambda.js";

export default class ConanAwsLambdaPlugin {
	constructor (conan) {
		conan.lambda = this.lambda;
		conan.lambdas = {};
	}

	lambda(name, handlerName) {
		return new ConanAwsLambda(this, name, handlerName);
	}
}
