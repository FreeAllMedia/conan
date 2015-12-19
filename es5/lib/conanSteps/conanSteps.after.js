"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = after;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

function after(existingStep, afterStep, parameters) {
	var _ = (0, _incognito2["default"])(this);

	var step = _.steps.find(function (step) {
		return step.handler === existingStep;
	});

	var index = _.steps.indexOf(step);

	_.steps.splice(index + 1, 0, {
		handler: afterStep,
		parameters: parameters
	});
}

module.exports = exports["default"];