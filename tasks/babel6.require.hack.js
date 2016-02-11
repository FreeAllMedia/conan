export default function requireHack() {
	const Module = require("module");
	const oldRequire = Module.prototype.require;
	Module.prototype.require = function newRequire() {
		const required = oldRequire.apply(this, arguments);
		if(required && required.__esModule && required.default) {
			if(Object.assign) {
				Object.assign(required.default, required);
			} else {
				Object.keys(required.default).forEach(
					(key) => {
						required.default[key] = required[key];
					}
				);
			}
			return required.default;
		} else {
			return required;
		}
	};
}
