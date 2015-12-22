import privateData from "incognito";

export default class ConanComponent {
	constructor(...componentArguments) {
		privateData(this).parameters = {};

		//initialize the parameters object
		this.initialize.apply(this, componentArguments);
	}

	initialize() {} // Stub for overridding

	parameters(...newParameters) {
		const _ = privateData(this);

		if (newParameters.length > 0) {
			newParameters.forEach(parameterName => {

				const getterSetterFunction = (newValue) => {
					if (newValue) {
						_.parameters[parameterName] = newValue;
						return this; // For chaining
					} else {
						return _.parameters[parameterName];
					}
				};

				this[parameterName] = getterSetterFunction;
			});
		} else {
			return _.parameters;
		}
	}
}
