export default class ConanComponent {
	constructor(parameters) {
		this.parameters = parameters || {};
		this.initialize(this.parameters);
	}

	initialize() {} // Stub for overridding
}
