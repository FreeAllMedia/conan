export default class LambdaClass {
	/* istanbul ignore next */
	constructor(event, context) {
		this.event = event;
		this.context = context;
	}

	/* istanbul ignore next */
	handler(event, context) {
		context.succeed("OK!");
	}
}
