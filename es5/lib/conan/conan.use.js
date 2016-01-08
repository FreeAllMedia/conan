"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = use;

function use(PluginClass) {
	this.plugins.push(new PluginClass(this));
}

module.exports = exports["default"];