import privateData from "incognito";

export default function add(conanStep) {
	privateData(this).steps.push(conanStep);
}
