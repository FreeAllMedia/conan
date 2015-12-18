"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = before;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

function before(existingStep, beforeStep) {
	var _ = (0, _incognito2["default"])(this);

	var index = _.steps.indexOf(existingStep);

	_.steps.splice(index, 0, beforeStep);
}

module.exports = exports["default"];