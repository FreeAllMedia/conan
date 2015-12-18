import ConanContext from "./conanContext.js";

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
		this.context = new ConanContext();
		this.plugins = [];
	}

	use(ConanPlugin) {
		return require("./conan/conan.use.js").call(this, ConanPlugin);
	}

	get version() {
		return require("./conan/conan.version.js").call(this);
	}
}
