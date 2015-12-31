import ConanAwsLambda from "./components/conanAwsLambda.js";
import AWS from "aws-sdk";

export default class ConanAwsLambdaPlugin {
	constructor (conan) {
		conan.lambda = this.lambda;
		conan.lambdas = {};
		conan.steps.library("AWS", AWS);
	}

	lambda(name, filePath, handlerName) {
		return new ConanAwsLambda(this, name, filePath, handlerName);
	}
}
