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

var _temp = require("temp");

var _temp2 = _interopRequireDefault(_temp);

function start(callback) {
	var _ = (0, _incognito2["default"])(this);
	var accumulatedResults = {};

	_temp2["default"].track();

	_temp2["default"].mkdir("conanSteps", function (error, temporaryDirectoryPath) {
		_flowsync2["default"].mapSeries(_.steps, function (step, done) {

			var context = {
				temporaryDirectoryPath: temporaryDirectoryPath,
				libraries: _.libraries,
				parameters: step.parameters,
				results: Object.assign({}, accumulatedResults)
			};

			step.handler(_.parent, context, function (stepError, stepResult) {
				Object.assign(accumulatedResults, stepResult);
				done(stepError, stepResult);
			});
		}, function () {
			_temp2["default"].cleanup(callback);
		});
	});
}

module.exports = exports["default"];