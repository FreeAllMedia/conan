"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = findByName;

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function findByName(stepName) {
	var foundSteps = (0, _incognito2.default)(this).steps.filter(function (step) {
		return step.handler.name === stepName;
	});

	return foundSteps[0];
}