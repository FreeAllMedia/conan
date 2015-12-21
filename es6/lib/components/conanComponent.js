export default class ConanComponent {
	constructor(...parameters) {
		//initialize the parameters object
		this.parameters = {};
		this.initialize.apply(this, parameters);
	}

	initialize() {} // Stub for overridding
}
