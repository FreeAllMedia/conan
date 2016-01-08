"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = all;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

function all() {
	return (0, _incognito2["default"])(this).steps;
}

module.exports = exports["default"];