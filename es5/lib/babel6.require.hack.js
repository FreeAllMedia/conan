"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = requireHack;
function requireHack() {
	var Module = require("module");
	var oldRequire = Module.prototype.require;
	Module.prototype.require = function newRequire() {
		var required = oldRequire.apply(this, arguments);
		if (required && required.__esModule && required.default) {
			if (Object.assign) {
				Object.assign(required.default, required);
			} else {
				Object.keys(required.default).forEach(function (key) {
					required.default[key] = required[key];
				});
			}
			return required.default;
		} else {
			return required;
		}
	};
}