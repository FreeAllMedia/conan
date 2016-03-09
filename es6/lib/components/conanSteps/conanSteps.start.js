import privateData from "incognito";
import Async from "flowsync";
import temp from "temp";
import inflect from "jargon";

export default function start(callback) {
	const _ = privateData(this);
	let accumulatedResults = {};

	temp.track();

	temp.mkdir("conanSteps", (error, temporaryDirectoryPath) => {

		Async.mapSeries(_.steps, (step, done) => {
			const context = {
				temporaryDirectoryPath: temporaryDirectoryPath,
				libraries: this.libraries,
				parameters: step.parameters,
				results: Object.assign({}, accumulatedResults)
			};
			const beforeRunTime = new Date().getTime();
			// console.log(`${step.handler.name} Started`);
			step.handler(_.parent, context, (stepError, stepResult) => {
				Object.assign(accumulatedResults, stepResult);
				// HACK: Need proper logging/reporting.
				process.stdout.write(`${inflect(step.handler.name).table.toString().replace(/_/g, " ").replace(" steps", "")} - ${new Date().getTime() - beforeRunTime}ms\n`);
				done(stepError, stepResult);
			});
		}, (errors) => {
			temp.cleanup(() => {
				callback(errors);
			});
		});
	});
}
