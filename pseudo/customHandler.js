export function handler(event, context) {
	const LambdaClass = require(`./lambda.js`);
	const lambda = new LambdaClass(event, context);
	lambda.invoke(event, context);
}
