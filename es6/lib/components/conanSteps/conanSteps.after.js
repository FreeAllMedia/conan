import privateData from "incognito";

export default function after(existingStep, afterStep, parameters) {
	const _ = privateData(this);

	const foundStep = _.steps.find(step => {
		return step.handler === existingStep;
	});

	const index = _.steps.indexOf(foundStep);
	const nextIndex = index + 1;

	_.steps.splice(nextIndex, 0, {
		handler: afterStep,
		parameters: parameters
	});
}
