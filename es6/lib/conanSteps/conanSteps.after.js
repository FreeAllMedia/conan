import privateData from "incognito";

export default function after(existingStep, afterStep) {
	const _ = privateData(this);

	const index = _.steps.indexOf(existingStep);

	_.steps.splice(index+1, 0, afterStep);
}
