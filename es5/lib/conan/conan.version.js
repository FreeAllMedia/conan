"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = version;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _packageJson = require("../../../package.json");

var _packageJson2 = _interopRequireDefault(_packageJson);

function version() {
	return _packageJson2["default"].version;
}

module.exports = exports["default"];