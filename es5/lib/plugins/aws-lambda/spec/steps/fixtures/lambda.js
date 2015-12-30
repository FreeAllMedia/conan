"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = handler;

function handler(event, context) {
	var name = event.name;
	context.succeed("Hello, " + name + "!");
}

module.exports = exports["default"];