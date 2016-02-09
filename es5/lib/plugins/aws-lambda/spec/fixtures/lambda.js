"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.handler = handler;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _saveJs = require("./save.js");

var _saveJs2 = _interopRequireDefault(_saveJs);

/* istanbul ignore next */

function handler(event, context) {
	(0, _saveJs2["default"])(event, function () {
		context.succeed("Saved!");
	});
}