import privateData from "incognito";

export default function add(conanStep, parameters) {
	privateData(this).steps.push({handler: conanStep, parameters: parameters});
}
