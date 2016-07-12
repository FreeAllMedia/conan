import ConanSteps from "./components/conanSteps.js";
import ChainLink from "mrt";

/**
 * @class Conan
 */
export default class Conan extends ChainLink {
	/**
	 * @method initialize
	 * @param {Object} config A configuration object that is saved to `conan.config`. There are no options by default, but plugins can add many of them.
	 * @return {Conan} An instantiated copy of Conan
	 */
	initialize(config) {
		this.config = config || {};
		this.steps = new ConanSteps(this);
		this.plugins = [];
	}

	use(...conanPlugins) {
		conanPlugins.forEach(ConanPlugin => this.plugins.push(new ConanPlugin(this)));
		return this;
	}

	deploy(callback) {
		this.steps.start(callback);
	}

	get version() {
		return require("../../package.json").version;
	}
}
