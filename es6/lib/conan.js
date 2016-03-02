import ConanSteps from "./components/conanSteps.js";
import ConanComponent from "./components/conanComponent.js";

/**
 * @class Conan
 */
export default class Conan {
	/**
	 * @constructor
	 * @method constructor
	 * @param {Object} config A configuration object that is saved to `conan.config`. There are no options by default, but plugins can add many of them.
	 * @return {Conan} An instantiated copy of Conan
	 */
	constructor(config) {
		this.config = config || {};
		this.components = { all: [] };
		this.steps = new ConanSteps(this);
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

	addComponent(componentName, ComponentConstructor) {
		this.components[componentName] = [];
		this[componentName] = (...parameters) => {
			parameters.unshift(this);
			const component = new ComponentConstructor(...parameters);
			this.components[componentName].push(component);
			this.components.all.push(component);
			return component;
		};
	}
}

export { ConanComponent };
