import { ConanComponent } from "conan";
import SomeStep from "./steps/someStep.js";

export default class ConanAWSLambda extends ConanComponent {
	initialize(conan) {
		conan.steps
			.step(() => {
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
