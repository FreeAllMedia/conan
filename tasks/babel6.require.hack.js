export default function requireHack() {
	const Module = require("module");
	const oldRequire = Module.prototype.require;
	Module.prototype.require = function newRequire() {
		const required = oldRequire.apply(this, arguments);
		if(required && required.__esModule && required.default) {
			Object.assign(required.default, required);
			return required.default;
		} else {
			return required;
		}
	};
}
