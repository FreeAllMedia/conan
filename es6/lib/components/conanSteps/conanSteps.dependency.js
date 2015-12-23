import privateData from "incognito";

export default function dependency(name, value) {
	privateData(this).dependencies[name] = value;
}
