import privateData from "incognito";
import Async from "flowsync";
import temp from "temp";

export default function start(callback) {
	const _ = privateData(this);
	let accumulatedResults = {};

	temp.track();

	temp.mkdir("conanSteps", (error, temporaryDirectoryPath) => {
		Async.mapSeries(_.steps, (step, done) => {
			const context = {
				temporaryDirectoryPath: temporaryDirectoryPath,
				dependencies: _.dependencies,
				parameters: step.parameters,
				results: Object.assign({}, accumulatedResults)
			};

			step.handler(_.parent, context, (stepError, stepResult) => {
				Object.assign(accumulatedResults, stepResult);
				done(stepError, stepResult);
			});
		}, () => {
			temp.cleanup(callback);
		});
	});
}
