"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = library;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

function library(name, value) {
	(0, _incognito2["default"])(this).libraries[name] = value;
}

module.exports = exports["default"];