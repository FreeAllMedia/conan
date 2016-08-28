import Staircase from "staircase";
import privateData from "incognito";
import ConanComponent from "./conanComponent.js";

/**
 * @class Conan
 */
export default class Conan extends ConanComponent {
	/**
	 * @method initialize
	 * @param {Object} config A configuration object that is saved to `conan.config`. There are no options by default, but plugins can add them.
	 * @return {Conan} An instantiated copy of Conan
	 */
	initialize(config) {
		this.config = config || {};
		this.plugins = [];

		const _ = privateData(this);

		_.staircase = new Staircase(this);

		this.steps = _.staircase.steps;
	}

	component(name, Constructor) {
		return this.link(name, Constructor).arguments(this);
	}

	parallel(...steps) {
		privateData(this).staircase.parallel(...steps);
		return this;
	}

	series(...steps) {
		privateData(this).staircase.series(...steps);
		return this;
	}

	step(...steps) {
		privateData(this).staircase.step(...steps);
		return this;
	}

	use(...conanPlugins) {
		conanPlugins.forEach(ConanPlugin => this.plugins.push(new ConanPlugin(this)));
		return this;
	}

	deploy(callback) {
		privateData(this).staircase.results(callback);
	}

	get version() {
		return require("../../package.json").version;
	}
}
