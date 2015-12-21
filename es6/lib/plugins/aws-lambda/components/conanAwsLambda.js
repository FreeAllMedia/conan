import ConanComponent from "../../../components/conanComponent.js";

export default class ConanAwsLambda extends ConanComponent {
	initialize(conan, name, filePath, handler) {
		this.conan = conan;

		this.parameters.name = name;
		this.parameters.filePath = filePath;
		this.parameters.handler = handler;

		// attach steps to conan region
		// find lambda
		// create zip
		// create/update lambda
		// request method
		// response methods
		// this.parameters = new ConanParameter(this);
		// this.parameters.add("description", "runtime", "role", "memorySize", "timeout", "publish");
		this.chainableParameters("description", "runtime", "role", "memorySize", "timeout", "publish");
	}

	chainableParameters(...functions) {
		functions.forEach(functionName => {
			let newChainedFunction = (value) => {
				this.parameters[functionName] = value;
				return this;
			};
			this[functionName] = newChainedFunction;
		});
	}

	// runtime(runtime) {
	// 	this.parameters.runtime = runtime;
	// 	return this;
	// }

	// role(role) {
	// 	this.parameters.role = role;
	// 	return this;
	// }

	// description(description) {
	// 	this.parameters.description = description;
	// 	return this;
	// }

	// memorySize(description) {
	// 	this.parameters.memorySize = memorySize;
	// 	return this;
	// }

	// timeout(description) {
	// 	this.parameters.timeout = timeout;
	// 	return this;
	// }

	// publish(description) {
	// 	this.parameters.publish = publish;
	// 	return this;
	// }
}
