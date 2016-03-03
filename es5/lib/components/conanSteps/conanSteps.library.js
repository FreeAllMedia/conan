"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = library;
function library(name, value) {
	this.libraries[name] = value;
}