"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = after;

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function after(existingStep, afterStep, parameters) {
	var _ = (0, _incognito2.default)(this);

	var foundStep = _.steps.find(function (step) {
		return step.handler === existingStep;
	});

	var index = _.steps.indexOf(foundStep);
	var nextIndex = index + 1;

	_.steps.splice(nextIndex, 0, {
		handler: afterStep,
		parameters: parameters
	});
}