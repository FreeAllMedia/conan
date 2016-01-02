import privateData from "incognito";
import Async from "flowsync";
import temp from "temp";

export default function start(callback) {
	const _ = privateData(this);
	let accumulatedResults = {};

	temp.track();

	temp.mkdir("conanSteps", (error, temporaryDirectoryPath) => {
		Async.mapSeries(_.steps, (step, done) => {
			console.log("running step: ", step.handler.name);
			const context = {
				temporaryDirectoryPath: temporaryDirectoryPath,
				libraries: _.libraries,
				parameters: step.parameters,
				results: Object.assign({}, accumulatedResults)
			};

			console.log("Calling handler.");
			step.handler(_.parent, context, (stepError, stepResult) => {
				console.log("Handler complete.");
				Object.assign(accumulatedResults, stepResult);
				done(stepError, stepResult);
			});

		}, () => {
			console.log("Steps complete.");
			temp.cleanup(callback);
		});
	});
}
