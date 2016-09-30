import { ConanPlugin } from "conan";
import SomeStep from "./steps/someStep.js";

export default class ConanAWSLambda extends ConanPlugin {
	initialize(conan) {
		conan.step(() => {
			conan.step(SomeStep);
		});
	}
}


// package.json

{
	"conanDependencies": {
		"conan-aws-lambda": "0.0.2"
	}
}
