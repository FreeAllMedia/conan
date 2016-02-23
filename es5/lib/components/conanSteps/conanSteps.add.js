"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = add;

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function add(conanStep, parameters) {
	(0, _incognito2.default)(this).steps.push({ handler: conanStep, parameters: parameters });
}