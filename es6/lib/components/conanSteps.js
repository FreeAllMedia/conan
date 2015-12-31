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
		return require("./conanSteps/conanSteps.add.js").call(this, conanStep, parameters);
	}

	before(existingStep, beforeStep, parameters) {
		return require("./conanSteps/conanSteps.before.js").call(this, existingStep, beforeStep, parameters);
	}

	after(existingStep, afterStep, parameters) {
		return require("./conanSteps/conanSteps.after.js").call(this, existingStep, afterStep, parameters);
	}

	start(callback) {
		return require("./conanSteps/conanSteps.start.js").call(this, callback);
	}

	findByName(stepName) {
		return require("./conanSteps/conanSteps.findByName.js").call(this, stepName);
	}

	get all() {
		return require("./conanSteps/conanSteps.all.js").call(this);
	}

	library(name, value) {
		return require("./conanSteps/conanSteps.library.js").call(this, name, value);
	}
}
