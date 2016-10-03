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

		this.stepGroups = _.staircase.stepGroups;
	}

	parallel(...steps) {
		return privateData(this).staircase.parallel(...steps);
	}

	series(...steps) {
		return privateData(this).staircase.series(...steps);
	}

	step(step) {
		privateData(this).staircase.step(step);
		return this;
	}

	stepNames() {
		const names = [];

		this.stepGroups().forEach(stepGroup => {
			stepGroup.steps.forEach(step => {
				names.push(step.name);
			});
		});

		return names;
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
