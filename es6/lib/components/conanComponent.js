import privateData from "incognito";

export default class ConanComponent {
	constructor(...conanComponentArguments) {
		privateData(this).parameters = {};

		//initialize the parameters object
		this.initialize.apply(this, conanComponentArguments);
	}

	initialize() {} // Stub for overridding

	parameters(...newParameters) {
		const _ = privateData(this);

		let returnValue;

		if (newParameters.length > 0) {
			newParameters.forEach(parameterName => {

				const getterSetterFunction = (newValue) => {
					if (newValue) {
						_.parameters[parameterName] = newValue;
						returnValue = this; // For chaining
					} else {
						returnValue = _.parameters[parameterName];
					}
				};

				this[parameterName] = getterSetterFunction;
			});
		} else {
			returnValue = _.parameters;
		}

		return returnValue;
	}

	multipleValueParameters(...newParameters) {
		const _ = privateData(this);

		newParameters.forEach(parameterName => {

			const getterSetterFunction = (...newValues) => {
				if (newValues.length > 0) {
					_.parameters[parameterName] = newValues;
					return this; // For chaining
				} else {
					return _.parameters[parameterName];
				}
			};

			_.parameters[parameterName] = [];
			this[parameterName] = getterSetterFunction;
		});
	}

	aggregateValueParameters(...newParameters) {
		const _ = privateData(this);

		newParameters.forEach(parameterName => {

			const getterSetterFunction = (...newValues) => {
				_.parameters[parameterName] = _.parameters[parameterName] || [];
				if (newValues.length > 0) {
					_.parameters[parameterName] = _.parameters[parameterName].concat(newValues);
					return this; // For chaining
				} else {
					return _.parameters[parameterName];
				}
			};

			this[parameterName] = getterSetterFunction;
		});
	}

	multipleValueAggregateParameters(...newParameters) {
		const _ = privateData(this);

		newParameters.forEach(parameterName => {
			_.parameters[parameterName] = _.parameters[parameterName] || [];

			const getterSetterFunction = (...newValues) => {
				if (newValues.length > 0) {
					_.parameters[parameterName].push(newValues);
					return this; // For chaining
				} else {
					return _.parameters[parameterName];
				}
			};

			_.parameters[parameterName] = [];
			this[parameterName] = getterSetterFunction;
		});
	}
}
