import privateData from "incognito";

export default class ConanSteps {
	constructor() {
		privateData(this).steps = [];
	}

	add(conanStep) {
		return require("./conanSteps/conanSteps.add.js").call(this, conanStep);
	}

	get all() {
		return require("./conanSteps/conanSteps.all.js").call(this);
	}
}
