import ConanAwsLambda from "./components/conanAwsLambda.js";
import AWS from "aws-sdk";

export default class ConanAwsLambdaPlugin {
	constructor (conan) {
		conan.config.region = conan.config.region || "us-east-1";
		conan.config.basePath = conan.config.basePath || process.cwd();
		conan.lambdas = {};
		conan.lambda = this.lambda;
		conan.steps.library("AWS", AWS);
	}

	lambda(name, filePath, handlerName) {
		return new ConanAwsLambda(this, name, filePath, handlerName);
	}
}
