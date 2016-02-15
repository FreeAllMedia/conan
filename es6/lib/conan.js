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
}

export { ConanComponent };
