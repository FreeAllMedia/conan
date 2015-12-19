import privateData from "incognito";
import Async from "flowsync";

export default function start(callback) {
	const _ = privateData(this);
	let accumulatedResults = {};
	Async.mapSeries(_.steps, (step, done) => {
		const context = {
			parameters: step.parameters,
			results: Object.assign({}, accumulatedResults)
		};

		step.handler(_.parent, context, (stepError, stepResult) => {
			Object.assign(accumulatedResults, stepResult);
			done(stepError, stepResult);
		});
	}, callback);
}
