import privateData from "incognito";

export default function before(existingStep, beforeStep, parameters) {
	const _ = privateData(this);

	const step = _.steps.find(step => {
		return step.handler === existingStep;
	});

	const index = _.steps.indexOf(step);

	_.steps.splice(index, 0, {
		handler: beforeStep,
		parameters: parameters
	});
}
