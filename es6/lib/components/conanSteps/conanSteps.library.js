import privateData from "incognito";

export default function library(name, value) {
	privateData(this).libraries[name] = value;
}
