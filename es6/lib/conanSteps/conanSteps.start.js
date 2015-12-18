import privateData from "incognito";
import Async from "flowsync";

export default function start(callback) {
	const _ = privateData(this);
	Async.mapSeries(_.steps, (step, done) => {
		step(_.parent, _.context, done);
	}, callback);
}
