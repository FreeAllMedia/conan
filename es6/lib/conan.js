import ConanSteps from "./components/conanSteps.js";

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
		this.steps = new ConanSteps();
		this.plugins = [];
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
