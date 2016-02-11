"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.handler = handler;

var _save = require("./save.js");

var _save2 = _interopRequireDefault(_save);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
function handler(event, context) {
	(0, _save2.default)(event, function () {
		context.succeed("Saved!");
	});
}