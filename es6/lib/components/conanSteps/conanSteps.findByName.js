import privateData from "incognito";

export default function findByName(stepName) {
	const foundSteps = privateData(this).steps.filter((step) => {
		return step.handler.name === stepName;
	});

	return foundSteps[0];
}
