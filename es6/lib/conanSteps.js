import privateData from "incognito";

export default class ConanSteps {
	constructor() {
		privateData(this).steps = [];
	}

	add(conanStep) {
		return require("./conanSteps/conanSteps.add.js").call(this, conanStep);
	}

	before(existingStep, beforeStep) {
		return require("./conanSteps/conanSteps.before.js").call(this, existingStep, beforeStep);
	}

	after(existingStep, afterStep) {
		return require("./conanSteps/conanSteps.after.js").call(this, existingStep, afterStep);
	}

	start(callback) {
		return require("./conanSteps/conanSteps.start.js").call(this, callback);
	}

	get all() {
		return require("./conanSteps/conanSteps.all.js").call(this);
	}
}
