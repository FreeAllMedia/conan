import ConanSteps from "./components/conanSteps.js";
import ConanAwsLambdaPlugin from "./plugins/aws-lambda/conanAwsLambdaPlugin.js";

/**
 * @class Conan
 */
export default class Conan {
	/**
	 * @constructor
	 * @method constructor
	 * @return {undefined} Nothing is returned.
	 */
	constructor(config) {
		this.config = config || {};
		this.steps = new ConanSteps(this);
		this.plugins = [];
		this.use(ConanAwsLambdaPlugin);
	}

	use(ConanPlugin) {
		this.plugins.push(new ConanPlugin(this));
	}

	deploy(callback) {
		this.steps.start(callback);
	}

	get version() {
		return require("../../package.json").version;
	}
}
