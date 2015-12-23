"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = dependency;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

function dependency(name, value) {
	(0, _incognito2["default"])(this).dependencies[name] = value;
}

module.exports = exports["default"];