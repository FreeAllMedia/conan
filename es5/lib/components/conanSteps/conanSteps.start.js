"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = start;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

var _flowsync = require("flowsync");

var _flowsync2 = _interopRequireDefault(_flowsync);

function start(callback) {
	var _ = (0, _incognito2["default"])(this);
	var accumulatedResults = {};
	_flowsync2["default"].mapSeries(_.steps, function (step, done) {
		var context = {
			dependencies: _.dependencies,
			parameters: step.parameters,
			results: Object.assign({}, accumulatedResults)
		};

		step.handler(_.parent, context, function (stepError, stepResult) {
			Object.assign(accumulatedResults, stepResult);
			done(stepError, stepResult);
		});
	}, callback);
}

module.exports = exports["default"];