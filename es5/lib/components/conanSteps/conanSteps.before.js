"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = before;

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function before(existingStep, beforeStep, parameters) {
	var _ = (0, _incognito2.default)(this);

	var step = _.steps.find(function (currentStep) {
		return currentStep.handler === existingStep;
	});

	var index = _.steps.indexOf(step);

	_.steps.splice(index, 0, {
		handler: beforeStep,
		parameters: parameters
	});
}