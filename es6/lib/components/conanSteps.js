import privateData from "incognito";

export default class ConanSteps {
	constructor(parent) {
		const _ = privateData(this);
		_.libraries = {};
		_.parent = parent;
		_.steps = [];
	}

	get parent() {
		return privateData(this).parent;
	}

	add(conanStep, parameters) {
		return require("./conanSteps/conanSteps.add.js").default.call(this, conanStep, parameters);
	}

	before(existingStep, beforeStep, parameters) {
		return require("./conanSteps/conanSteps.before.js").default.call(this, existingStep, beforeStep, parameters);
	}

	after(existingStep, afterStep, parameters) {
		return require("./conanSteps/conanSteps.after.js").default.call(this, existingStep, afterStep, parameters);
	}

	start(callback) {
		return require("./conanSteps/conanSteps.start.js").default.call(this, callback);
	}

	findByName(stepName) {
		return require("./conanSteps/conanSteps.findByName.js").default.call(this, stepName);
	}

	get all() {
		return require("./conanSteps/conanSteps.all.js").default.call(this);
	}

	library(name, value) {
		return require("./conanSteps/conanSteps.library.js").default.call(this, name, value);
	}
}
