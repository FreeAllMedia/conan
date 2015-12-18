import privateData from "incognito";

export default function before(existingStep, beforeStep) {
	const _ = privateData(this);

	const index = _.steps.indexOf(existingStep);

	_.steps.splice(index, 0, beforeStep);
}
