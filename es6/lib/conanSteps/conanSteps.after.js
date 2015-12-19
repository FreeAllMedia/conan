import privateData from "incognito";

export default function after(existingStep, afterStep, parameters) {
	const _ = privateData(this);

	const step = _.steps.find(step => {
		return step.handler === existingStep;
	});

	const index = _.steps.indexOf(step);

	_.steps.splice(index+1, 0, {
		handler: afterStep,
		parameters: parameters
	});
}
